import Navbar from '../Navbar'

export default function NavbarExample() {
  const mockCategories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Fashion", slug: "fashion" },
    { name: "Home & Living", slug: "home-living" },
    { name: "Sports", slug: "sports" }
  ];

  return (
    <div className="bg-background">
      <Navbar categories={mockCategories} />
      <div className="p-12 text-center text-muted-foreground">
        Content below navbar
      </div>
    </div>
  )
}
