import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In production mode, warn if Supabase is not configured
const isProduction = import.meta.env.PROD;

if (!supabaseUrl || !supabaseAnonKey) {
  const message = 'Supabase environment variables are not set. Image uploads will not work. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.';
  
  if (isProduction) {
    console.error(message);
  } else {
    console.warn(message);
  }
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Generate a unique file name using crypto.randomUUID for better collision resistance
 * @param {string} originalName - Original file name
 * @returns {string} Unique file name
 */
function generateUniqueFileName(originalName) {
  const fileExt = originalName.split('.').pop();
  const uuid = crypto.randomUUID();
  return `${uuid}.${fileExt}`;
}

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket name (e.g., 'listing-images', 'profile-images')
 * @param {string} folder - The folder path within the bucket (e.g., 'listings', 'profiles')
 * @returns {Promise<{url: string | null, error: Error | null}>}
 */
export async function uploadImage(file, bucket = 'listing-images', folder = null) {
  if (!supabase) {
    return { 
      url: null, 
      error: new Error('Supabase is not configured. Please set environment variables.') 
    };
  }

  try {
    // Generate a unique file name using UUID for collision resistance
    const fileName = generateUniqueFileName(file.name);
    // Use provided folder or default based on bucket name
    const folderPath = folder || (bucket === 'profile-images' ? 'profiles' : 'listings');
    const filePath = `${folderPath}/${fileName}`;

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
