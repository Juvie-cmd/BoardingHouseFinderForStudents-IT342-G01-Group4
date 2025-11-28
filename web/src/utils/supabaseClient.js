import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are not set. Image uploads will not work. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket name (e.g., 'listing-images')
 * @returns {Promise<{url: string | null, error: Error | null}>}
 */
export async function uploadImage(file, bucket = 'listing-images') {
  if (!supabase) {
    return { 
      url: null, 
      error: new Error('Supabase is not configured. Please set environment variables.') 
    };
  }

  try {
    // Generate a unique file name to avoid conflicts
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { url: null, error: uploadError };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: null, error };
  }
}

/**
 * Upload multiple files to Supabase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} bucket - The storage bucket name
 * @param {function} onProgress - Callback for progress updates (optional)
 * @returns {Promise<{urls: string[], errors: Error[]}>}
 */
export async function uploadMultipleImages(files, bucket = 'listing-images', onProgress = null) {
  const urls = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { url, error } = await uploadImage(file, bucket);
    
    if (url) {
      urls.push(url);
    }
    if (error) {
      errors.push(error);
    }
    
    if (onProgress) {
      onProgress((i + 1) / files.length * 100, i + 1, files.length);
    }
  }

  return { urls, errors };
}
