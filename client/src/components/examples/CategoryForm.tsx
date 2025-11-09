import CategoryForm from '../CategoryForm'

export default function CategoryFormExample() {
  const handleSubmit = (data: any, image?: File) => {
    console.log('Form submitted:', data, 'Image:', image);
  };

  return (
    <div className="p-6 bg-background">
      <div className="max-w-2xl">
        <CategoryForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
