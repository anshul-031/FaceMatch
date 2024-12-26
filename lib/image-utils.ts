export async function handleImageUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  setImage: (value: string | null) => void
) {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImage(base64String);
    };
    reader.readAsDataURL(file);
  }
}