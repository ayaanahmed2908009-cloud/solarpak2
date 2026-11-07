import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero, { Accent } from "@/components/premium/PageHero";

export default function NotFound() {
  return (
    <div className="sp sp-page min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="404"
          title={
            <>
              This page <Accent>isn't here</Accent>
            </>
          }
          lede="The page you're looking for may have moved, or the link may be out of date."
          actions={
            <>
              <Link href="/" className="sp-btn">
                Go to the home page
              </Link>
              <Link href="/impact-labs" className="sp-link">
                Browse our research
              </Link>
            </>
          }
        />
      </main>
      <Footer />
    </div>
  );
}
