import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full bg-muted">
      <Navbar />
      <main className="bg-muted pt-40 pb-20">{children}</main>
      <Footer />
    </div>
  );
}
