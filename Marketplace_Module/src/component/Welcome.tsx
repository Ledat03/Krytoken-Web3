import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SiX, SiDiscord, SiInstagram } from "react-icons/si";
import { Input } from "@/components/ui/input";
import Background from "../../public/background/thumbnail.png";
import Exclusive01 from "../../public/background/Crescent_Guardian.webp";
import Loading01 from "../../public/background/CookieLoading_1.webp";
import Exclusive02 from "../../public/background/GuideOfTheCrumbled.gif";
import Loading02 from "../../public/background/CookieLoading2.webp";
import Exclusive03 from "../../public/background/Dusk_of_silence.webp";
import Loading03 from "../../public/background/CookieLoading3.webp";
import Cheer from "../../public/background/CheerCookie.webp";
import ExBackground from "../../public/background/Background.webp";
import CookieBackground from "../../public/background/CookieBackground.webp";
import Hang from "../../public/background/NinjaCookie-hang.webp";
import Intro from "../../public/background/Intro.mp4";
import { LoadingInit } from "./common/Loading";
const WelcomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoading, setShow] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setShow(false);
      }, 500);
    }, 3000);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const footerLinks = {
    about: [
      { label: "About Us", href: "#" },
      { label: "Team", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
    products: [
      { label: "NFT Collection", href: "#" },
      { label: "Toys & Merch", href: "#" },
      { label: " Cookie", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
    community: [
      { label: "Discord", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Blog", href: "#" },
    ],
  };
  return (
    <div>
      {showLoading ? (
        <div className={`w-full h-screen flex justify-center items-center bg-black transition-all duration-500 ease-in-out ${loading ? "opacity-100" : "opacity-0"}`}>
          <LoadingInit Loading={showLoading} />
        </div>
      ) : (
        <div className={`transition-all duration-500 ease-in-out ${showLoading ? "opacity-0" : "opacity-100"}`}>
          <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"}`}>
            <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
              <a href="/" className="flex gap-2 text-4xl bg-yellow-900 text-white w-fit px-3 py-2 rounded-2xl" data-testid="link-logo">
                <span className="cookie-text">Magic Oven</span>
              </a>
              <div className="hidden md:flex items-center gap-8"></div>

              <div className="hidden md:block">
                <a href="/home">
                  {" "}
                  <Button variant="default" size="default" className="rounded-full bg-yellow-900 cookie-text text-xl" data-testid="button-join-huddle">
                    Let's Make Cookies
                  </Button>
                </a>
              </div>
            </nav>
            <img className={`${scrolled ? "opacity-0 " : " opacity-100"}transition-all ease-in-out duration-1000 absolute`} src={Hang} alt="" />
          </header>
          <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: `
    linear-gradient(to top, 
      rgba(0,0,0,0.5) 0%, 
      rgba(0,0,0,0.7) 40%, 
      rgba(0,0,0,0.5) 70%, 
      transparent 100%
    ),
    url(${Background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
            data-testid="section-hero"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fade-in-up">
              <h1 className="text-6xl md:text-8xl lg:text-[150px] font-bold text-white mb-6 tracking-tight cookie-text" style={{ fontFamily: "Poppins, sans-serif" }} data-testid="text-hero-title">
                MAGIC OVEN
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed cookie-text" data-testid="text-hero-subtitle">
                Where enchanted cookies rise under moonlight ovens, weaving spells of sugar, stardust, and timeless delight
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/home">
                  <Button size="lg" variant="default" className="rounded-full font-semibold bg-yellow-900 cookie-text text-2xl">
                    Explore Collection
                  </Button>
                </a>
                <div>
                  <a href="https://cookierunkingdom.fandom.com/wiki/Cookie_Run:_Kingdom_Wiki">
                    {" "}
                    <Button size="lg" variant="outline" className="rounded-full  font-semibold opacity-80 cookie-text text-2xl text-yellow-900" data-testid="button-learn-more">
                      Learn More
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors animate-bounce" data-testid="link-scroll-down">
              <ChevronDown className="h-10 w-10" />
            </a>
          </section>
          <section
            className="h-screen py-24 md:py-32  border-y-5 border-black"
            style={{
              backgroundImage: `
    linear-gradient(to top, 
      rgba(0,0,0,0.9) 0%, 
      rgba(0,0,0,0.6) 40%, 
      rgba(0,0,0,0.2) 70%, 
      transparent 100%
    ),
    url(${ExBackground})
  `,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="max-w-full px-6 lg:px-8">
              <div className="grid  md:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* <div className="relative w-full h-full sm:overflow-hidden lg:overflow-visible">
              <img src={Cheer} alt="Exclusive Cookie" className="absolute bottom-0 left-0 w-[200px] h-[200px] object-cover" />
              <img src={Hang} alt="Exclusive Cookie" className="absolute top-0 right-0 w-[200px] h-[200px] object-cover" />
            </div> */}
                <div className="space-y-6 w-[50%] mx-auto">
                  <h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-50
             tracking-tight cookie-text ease-out duration-300  transition-all"
                    data-testid="text-brand-title"
                  >
                    Exclusive Cookies
                  </h2>
                  <p className="text-lg md:text-xl text-amber-50 leading-relaxed cookie-text" data-testid="text-brand-desc-1">
                    Welcome to MagicOven Market, your cozy corner of the internet where every bite is baked with love, mischief, and a sprinkle of magic.
                  </p>
                  <p className="text-lg md:text-xl text-amber-50 leading-relaxed cookie-text" data-testid="text-brand-desc-2">
                    Born from late-night cravings and wild flavor dreams, MagicOven is all about handcrafted cookies, brownies, and limited-edition treats that look almost too beautiful to eat—almost. We blend premium ingredients, craziest ideas, and a whole lot of thing to create desserts that will be satisfied you.
                  </p>

                  <p className="text-lg md:text-xl text-amber-50 leading-relaxed cookie-text" data-testid="text-brand-desc-3">
                    Step inside our enchanted kitchen: it’s warm, it smells like vanilla and adventure, and every order comes with a little extra happiness on the side. Your new favorite treat is waiting!
                  </p>
                </div>
                <div className="relative h-full">
                  <div className="relative rounded-2xl overflow-hidden h-full">
                    <div className="flex justify-between items-center">
                      <img src={Exclusive01} alt="Exclusive Cookie" className="w-[250px] h-[250px] object-cover rounded-[100px]" />
                      <span className="cookie-text text-4xl text-amber-50">Moonlight Cookie</span>
                      <img src={Loading01} alt="Exclusive Cookie" className=" object-cover  w-[300px] h-[250px] " />
                    </div>
                    <div className="flex justify-between items-center ">
                      <img src={Exclusive02} alt="Exclusive Cookie" className="w-[250px] h-[250px] object-cover rounded-[100px]" />
                      <span className="cookie-text text-4xl text-amber-50">Silent Salt Cookie</span>
                      <img src={Loading02} alt="Exclusive Cookie" className=" object-cover  w-[300px] h-[250px] " />
                    </div>
                    <div className="flex justify-between items-center">
                      <img src={Exclusive03} alt="Exclusive Cookie" className="w-[250px] h-[250px] object-cover rounded-[100px]" />
                      <span className="cookie-text text-4xl text-amber-50">Dark Cacao Cookie</span>
                      <img src={Loading03} alt="Exclusive Cookie" className=" object-cover  w-[300px] h-[250px] " />
                    </div>
                  </div>
                  <div className="absolute -z-10 top-8 -right-8 w-full h-full bg-primary/10 rounded-2xl" />
                </div>
              </div>
            </div>
          </section>{" "}
          <section className="relative w-full h-screen overflow-hidden">
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline poster="/poster.jpg">
              <source src={Intro} type="video/mp4" />
              Your browser don't support video !
            </video>

            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="text-center text-white px-6 space-y-10">
                <h1 className="text-5xl md:text-9xl font-bold mb-6 cookie-text">Discover Cookie Lore</h1>
                <p className="text-xl md:text-3xl cookie-text">Every cookie hides a forgotten spell from the lost kingdom of Doughmoria. Collect them. Wake the legend !!!</p>
                <Button className="w-[350px] h-[70px] ">
                  <a href="https://cookierunkingdom.fandom.com/wiki/Category:Lore" className="cookie-text text-4xl">
                    Let's Go
                  </a>
                </Button>
              </div>
            </div>
          </section>
          <section className="py-32 h-screen md:py-40 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 overflow-hidden border-y-5 border-y-black">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
              <div className="space-y-6">
                <h2 className="cookie-text text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">Magic Oven Marketplace</h2>
                <p className="cookie-text text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">MagicOven Market - Enchanting NFT marketplace where every cookie is a handcrafted digital collectible. Sweet, rare, and baked with magic: collect, trade, and savor exclusive treats that blend dessert artistry with blockchain wonder.</p>
              </div>

              <div className="relative w-full overflow-hidden py-8">
                <div className="flex animate-marquee whitespace-nowrap">
                  <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary/20 mx-8 cookie-text">LET'S START COLLECT YOUR OWN COOKIES</span>
                  <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary/20 mx-8 cookie-text">LET'S START COLLECT YOUR OWN COOKIES</span>
                </div>
              </div>

              <div className="relative max-w-5xl mx-auto">
                <Button className="w-full h-[60px] text-3xl rounded-2xl">
                  <a href="/home" className="cookie-text">
                    Discover Marketplace
                  </a>
                </Button>
              </div>
            </div>
          </section>
          <section
            className="h-screen relative"
            style={{
              backgroundImage: `
    linear-gradient(to top, 
      rgba(0,0,0,0.9) 0%, 
      rgba(0,0,0,0.6) 40%, 
      rgba(0,0,0,0.2) 70%, 
      transparent 100%
    ),
    url(${CookieBackground})
  `,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="max-w-full h-full">
              <div className="flex h-full">
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="text-center text-white px-6 space-y-10">
                    <h1 className="text-xl md:text-6xl font-bold mb-6 cookie-text">Cookies Information</h1>
                    <p className="text-xl md:text-3xl cookie-text">Curious what these glowing cookies actually are? Click to uncover their secret stories!</p>
                    <Button className="w-[350px] h-[70px] ">
                      <a href="https://cookierunkingdom.fandom.com/wiki/Cookies" className="cookie-text text-4xl">
                        Uncover
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>{" "}
          <footer className="bg-card border-t border-border pt-16 pb-8" data-testid="footer">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                  <h3 className="text-2xl cookie-text" data-testid="text-footer-logo">
                    Magic Oven
                  </h3>
                  <p className=" font-bold text-muted-foreground leading-relaxed">Join the bakery and be part of a global community celebrating creativity, fun, and good vibes.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-4">About</h4>
                  <ul className="space-y-3">
                    {footerLinks.about.map((link, index) => (
                      <li key={index}>
                        <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-4">Products</h4>
                  <ul className="space-y-3">
                    {footerLinks.products.map((link, index) => (
                      <li key={index}>
                        <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid={`link-footer-products-${index}`}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground" data-testid="text-footer-newsletter-title">
                    Stay Updated
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid="text-footer-newsletter-desc">
                    Get the latest news and updates from the Cookie Run Kingdom.
                  </p>

                  <div className="flex gap-4 pt-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover-elevate active-elevate-2 transition-all" aria-label="Twitter" data-testid="link-social-twitter">
                      <SiX className="h-5 w-5 text-primary" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover-elevate active-elevate-2 transition-all" aria-label="Discord" data-testid="link-social-discord">
                      <SiDiscord className="h-5 w-5 text-primary" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover-elevate active-elevate-2 transition-all" aria-label="Instagram" data-testid="link-social-instagram">
                      <SiInstagram className="h-5 w-5 text-primary" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};
export default WelcomePage;
