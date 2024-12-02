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
        <p className="text-lg md:text-2xl leading-relaxed py-6">
          Offriamo una gamma completa di soluzioni tecnologiche per ogni
          esigenza: riparazioni hardware e software, creazione di siti web,
          assistenza per reti e sicurezza informatica, e molto altro!
        </p>
      </div>

      <div
        id="services"
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

      <div id="blogs" className="mt-20 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center">Blog</h2>
        <div className="max-w-4xl mx-auto mt-4">
          <p className="text-lg leading-relaxed text-center">
            L’Innovazione Tecnologica al Servizio della Comunità. La tecnologia
            non è mai stata così importante come oggi. Le aziende, i
            professionisti e i singoli individui dipendono da soluzioni
            innovative per semplificare la vita quotidiana, ottimizzare i
            processi e risolvere problemi complessi. Noi, come azienda, siamo
            fieri di trovarci al centro di questo cambiamento, spingendo
            costantemente i confini di ciò che è possibile con la tecnologia
            moderna. Benvenuti nel Futuro!
          </p>
        </div>
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

      <div id="about" className="mt-20 mb-10 px-4" data-aos="fade-up">
        <div className="max-w-3xl mx-auto">
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
            <details className="border border-gray-300 rounded-lg p-4">
              <summary className="font-medium">
                Come posso creare un ticket?
              </summary>
              <p className="mt-2">
                Per creare un ticket, visita la nostra pagina dedicata al
                supporto sul sito ufficiale. Compila il modulo con i dettagli
                del tuo problema, incluso il tipo di dispositivo e una
                descrizione del problema. Una volta inviato, il nostro team ti
                contatterà per ulteriori dettagli o per avviare la procedura di
                assistenza.
              </p>
            </details>
            <details className="border border-gray-300 rounded-lg p-4">
              <summary className="font-medium">
                Quanto tempo richiedono le riparazioni?
              </summary>
              <p className="mt-2">
                I tempi di riparazione dipendono dalla complessità del problema
                e dalla disponibilità dei pezzi di ricambio. Solitamente, le
                riparazioni vengono completate entro 3-5 giorni lavorativi.
              </p>
            </details>
            <details className="border border-gray-300 rounded-lg p-4">
              <summary className="font-medium">
                Offrite garanzie sulle riparazioni?
              </summary>
              <p className="mt-2">
                Sì, tutte le nostre riparazioni sono coperte da una garanzia di
                90 giorni. Se il problema persiste, lo risolveremo gratuitamente
                durante questo periodo.
              </p>
            </details>
          </div>
        </div>
      </div>

      <div
        id="contacts"
        className="mt-20 p-8 bg-gray-100 rounded-lg shadow-lg mb-20"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Contattaci
        </h2>
        <p className="mt-4 text-lg text-center text-gray-600">
          Hai domande o hai bisogno di supporto? Siamo qui per aiutarti!
        </p>

        <div className="flex flex-col sm:flex-row justify-center mt-8  gap-6">
          <div className="flex items-center gap-4">
            <i className="fas fa-envelope text-2xl text-blue-500"></i>
            <a
              href="mailto:support@example.com"
              className="text-lg font-medium text-gray-700 hover:text-blue-500"
            >
              supportinfo@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <i className="fas fa-phone text-2xl text-purple-500"></i>
            <a
              href="tel:+123456789"
              className="text-lg font-medium text-gray-700 hover:text-purple-500"
            >
              +1 234 567 89
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button className="px-6 py-3 text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700">
            Scrivici
          </button>
          <button className="ml-4 px-6 py-3 text-purple-600 bg-white border border-purple-600 rounded-lg shadow-md hover:bg-purple-50">
            Chiama ora
          </button>
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
