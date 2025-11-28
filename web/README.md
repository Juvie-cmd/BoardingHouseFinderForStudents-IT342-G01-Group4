# Boarding House Finder - Web Frontend

This is the web frontend for the Boarding House Finder application, built with React + Vite.

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure the environment variables in `.env`:
   - `VITE_API_URL`: Backend API URL (e.g., `http://localhost:8080` for local development)
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Supabase Storage Setup

For image uploads to work, you need to set up Supabase Storage:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Storage** in the sidebar
3. Create a new bucket called `listing-images`
4. Set the bucket to **Public** (so images can be viewed without authentication)
5. Configure a storage policy to allow uploads:
   - For development/testing: Allow all authenticated and anonymous uploads
   - For production: Restrict uploads to authenticated users only

### Sample Storage Policy (for development)

```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');

-- Allow authenticated uploads
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'listing-images');
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 19
- Vite 7
- Axios for API calls
- @supabase/supabase-js for image storage
- React Router for navigation
- Leaflet for maps
