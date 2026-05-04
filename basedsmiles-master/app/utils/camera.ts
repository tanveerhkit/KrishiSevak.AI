import { createClient } from '@supabase/supabase-js'

// Define Image type interface
interface Image {
  url: string;
  timestamp: string;
  smileCount: number;
  smileScore: number;
  hasWon: boolean;
  isLoading: boolean;
  isNounish: boolean;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Function to initialize the camera stream
export const initCamera = async (videoRef: React.RefObject<HTMLVideoElement>) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 480 },
        height: { ideal: 360 }
      }
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.style.transform = 'scaleX(-1)'; // Flip the camera feed
    }
  } catch (err) {
    console.error("Error accessing camera:", err);
    alert("Unable to access camera. Please ensure you have granted camera permissions.");
  }
};

// Function to upload image to Supabase Storage
export const uploadImage = async (blob: Blob, userId: string, isNounish: boolean) => {
  const fileName = `${userId}/${Date.now()}.jpg`;

  try {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('smiles')
      .upload(fileName, blob);

    if (error) throw new Error(error.message);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('smiles')
      .getPublicUrl(fileName);

    return { url: publicUrl, isNounish };

  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Function to compress image
export const compressImage = async (blob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 480;
      const MAX_HEIGHT = 360;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Compression failed'));
        },
        'image/jpeg',
        0.9
      );
    };
    img.onerror = reject;
  });
};

// Function to load existing photos from Supabase
export const loadExistingPhotos = async (): Promise<Image[]> => {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading photos:', error.message || error.details || error);
      return []; // Return empty array if error occurs
    }

    return data.map(photo => ({
      url: photo.image_url,
      timestamp: photo.created_at,
      smileCount: photo.smile_count || 0,
      smileScore: photo.smile_score,
      hasWon: photo.smile_score > 3,
      isLoading: false,
      isNounish: photo.is_nounish || false
    }));

  } catch (error) {
    console.error('Error fetching photos:', error);
    return []; // Return empty array if error occurs
  }
};

// Function to handle "smile back" action by updating the smile count
export const handleSmileBack = async (imageUrl: string) => {
  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('photos')
      .select('smile_count')
      .eq('image_url', imageUrl)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('photos')
      .update({ smile_count: (currentData.smile_count || 0) + 1 })
      .eq('image_url', imageUrl);

    if (updateError) throw updateError;

    return (currentData.smile_count || 0) + 1;
  } catch (error) {
    console.error('Error updating smile count:', error);
    throw error;
  }
};

// Function to delete a photo from Supabase
export const deletePhoto = async (imageUrl: string, userId: string) => {
  try {
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .match({ user_id: userId, image_url: imageUrl });

    if (dbError) throw dbError;

    const fileName = imageUrl.split('/').pop();
    const { error: storageError } = await supabase.storage
      .from('smiles')
      .remove([`${userId}/${fileName}`]);

    if (storageError) throw storageError;
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};
