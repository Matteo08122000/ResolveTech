import React, { useEffect } from "react";
import clsx from "clsx";
import hardwareImg from "../../assets/repair.png";
import networkImg from "../../assets/network.png";
import securityImg from "../../assets/cybersecurity.png";
import websiteImg from "../../assets/web.png";
import repairImg from "../../assets/smartphone.png";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  const { theme } = useSelector((state) => state.theme || { theme: "light" });

  useEffect(() => {
    AOS.init({ duration: 1000, disable: "phone" });
  }, []);

  const items = [
    {
      icon: "💻",
      img: hardwareImg,
      alt: "Riparazioni hardware e software",
      text: "Riparazioni hardware e software su qualsiasi dispositivo elettronico.",
    },
    {
      icon: "🌐",
      img: websiteImg,
      alt: "Creazione di siti web",
      text: "Creazione di siti web personalizzati per ogni tipo di business o esigenza.",
    },
    {
      icon: "🔒",
      img: networkImg,
      alt: "Problemi di rete",
      text: "Risoluzione di problemi di rete per garantire connettività veloce e stabile.",
    },
    {
      icon: "🛡️",
      img: securityImg,
      alt: "Sicurezza informatica",
      text: "Protezione avanzata dei tuoi dati con soluzioni di sicurezza informatica.",
    },
    {
      icon: "🔧",
      img: repairImg,
      alt: "Riparazione di tablet, smartphone e PC",
      text: "Riparazione professionale di tablet, smartphone e PC per ogni tipo di danno.",
    },
  ];

  return (
    <section
      className={clsx(
        "relative min-h-screen flex flex-col items-center justify-center",
        theme === "light" ? "bg-purple-100 text-black" : "bg-black text-white"
      )}
      id="hero"
    >
      <div
        className="max-w-6xl mx-auto px-4 text-center space-y-6 mt-8"
        data-aos="fade-up"
      >
        <h1
          className={clsx(
            "text-4xl md:text-6xl font-bold leading-tight",
            theme === "light" ? "text-black" : "text-white"
          )}
        >
          <span className="block">Risolviamo ogni</span>
          <span className="block mt-4 text-purple-600">
            problema Tecnologico
          </span>
        </h1>
        <p className="text-lg md:text-2xl leading-relaxed">
          Offriamo una gamma completa di soluzioni tecnologiche per ogni
          esigenza: riparazioni hardware e software, creazione di siti web,
          assistenza per reti e sicurezza informatica, e molto altro!
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center mt-16 px-4"
        data-aos="zoom-in"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-4 transition-transform duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium italic">{item.alt}</span>
            </div>
            <img
              src={item.img}
              alt={item.alt}
              className="w-32 h-32 object-contain max-w-full rounded-lg mt-4"
            />
            <p className="text-lg font-medium text-center italic">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center" data-aos="fade-left">
        <h2 className="text-2xl font-bold">Perché sceglierci?</h2>
        <ul className="list-none mt-6 space-y-4 text-lg">
          <li className="flex items-center justify-center">
            ✅ Esperienza pluriennale nel settore
          </li>
          <li className="flex items-center justify-center">
            ✅ Assistenza rapida e personalizzata
          </li>
          <li className="flex items-center justify-center">
            ✅ Soluzioni innovative e su misura
          </li>
        </ul>
      </div>

      <div className="mt-20 mb-20" data-aos="fade-up">
        <h2 className="text-2xl font-bold text-center">Domande frequenti</h2>
        <div className="space-y-4 mt-6">
          <details className="border border-gray-300 rounded-lg p-4">
            <summary className="font-medium">
              Quali tipi di dispositivi riparate?
            </summary>
            <p className="mt-2">
              Ripariamo laptop, desktop, tablet, smartphone e molto altro.
            </p>
          </details>
          <details className="border border-gray-300 rounded-lg p-4">
            <summary className="font-medium">
              Fornite assistenza da remoto?
            </summary>
            <p className="mt-2">
              Sì, possiamo fornire supporto tecnico anche da remoto.
            </p>
          </details>
        </div>
      </div>

      {theme === "dark" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20 absolute -top-10 -left-20 animate-pulse"></div>
          <div className="w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 absolute top-20 -right-20 animate-pulse"></div>
        </div>
      )}
    </section>
  );
};

export default Hero;
