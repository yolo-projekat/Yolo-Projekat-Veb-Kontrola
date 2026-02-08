<div align="center">

# 🌐 YOLO Projekat Veb Kontrola
### *Next.js & React Dashboard za Real-time AI Upravljanje*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

<p align="center">
  <b>YOLO Veb Kontrola</b> predstavlja napredni klijentski interfejs izgrađen pomoću <b>React</b>-a i <b>Next.js</b>-a. 
  <br>Aplikacija služi kao komandni most za autonomno vozilo, integrišući video strim i WebSocket komunikaciju u jedinstven, moderan korisnički doživljaj.
</p>

</div>

## 🧩 React Arhitektura & Next.js Snaga

Ovaj projekat koristi prednosti moderne web arhitekture kako bi osigurao nultu latenciju i maksimalnu reaktivnost:

* **`use client` Direktivne:** Optimizovano za klijentsko renderovanje (CSR) kako bi se omogućio direktan pristup browser API-jima (WebSockets, EventListeners).
* **State Management:** Korišćenje React `useState` i `useEffect` kuka za upravljanje statusom konekcije i obradu dolaznih logova u realnom vremenu.
* **Performance:** Brzo učitavanje zahvaljujući Next.js optimizaciji resursa i Tailwind CSS-u za minimalni CSS otisak.
* **TypeScript Safety:** Ceo interfejs je strogo tipiziran, što sprečava greške prilikom slanja komandi ka robotu.

---

## 🎮 Kontrolna Logika

Interfejs je dizajniran da simulira profesionalne kontrolne panele:

### ⌨️ Tastatura (React Events)
Sistem mapira tastere direktno na WebSocket komande:
- **W / S**: Napred / Nazad
- **A / D**: Skretanje
- **Q / E**: Rotacija oko ose

### 📱 Touch & Mouse (Universal UI)
Svako dugme na ekranu podržava `onMouseDown` i `onTouchStart` događaje, omogućavajući "hold-to-move" funkcionalnost koja simulira pravi džojstik.

---

## 🛠 Tehnološki Stack

| Komponenta | Tehnologija | Uloga |
| :--- | :--- | :--- |
| **UI Library** | **React 18** | Reaktivne komponente i interfejs |
| **Framework** | **Next.js 14** | Routing i optimizacija |
| **Logic** | **TypeScript** | Sigurnost koda i tipovi podataka |
| **Icons** | **Lucide React** | Vizuelni simboli i indikatori |
| **Styling** | **Tailwind CSS** | Glassmorphism i Layout |

---

## 🔧 Mrežna Konfiguracija (Raspberry Pi 5)

Da bi kontrola radila, Next.js aplikacija komunicira sa Python backendom na vozilu:

> [!IMPORTANT]
> Proverite da li je vaš uređaj na istoj mreži kao i vozilo pre pokretanja komandne table.

* **WebSocket:** `ws://192.168.4.1:1606`
* **Video Feed:** `http://192.168.4.1:1607/capture`

---

<div align="center">

**Autor:** Danilo Stoletović • **Mentor:** Dejan Batanjac  
**ETŠ „Nikola Tesla“ Niš • 2026**

</div>
