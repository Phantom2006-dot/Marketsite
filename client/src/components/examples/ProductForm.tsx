import ProductForm from '../ProductForm'

export default function ProductFormExample() {
  const mockCategories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Living" }
  ];

  const handleSubmit = (data: any, images: File[]) => {
    console.log('Form submitted:', data, 'Images:', images);
  };

  return (
    <div className="p-6 bg-background">
      <div className="max-w-4xl">
        <ProductForm categories={mockCategories} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
