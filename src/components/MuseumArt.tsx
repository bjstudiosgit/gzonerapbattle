import { useState } from 'react';
import { FileText, Image, KeyRound, Smartphone, Package, ShoppingBag, FlaskConical, Utensils, Circle, Brush } from 'lucide-react';
import type { MuseumItem } from '../data/museum';

export const revisionSheetPhotos = [
  { src: '/museum/key-stage-revision-sheets-battle-cutout.webp', label: 'Sheet 1' },
  { src: '/museum/key-stage-revision-sheets-battle-cutout-2.webp', label: 'Sheet 2' },
];

export const gravePhotos = [
  { src: '/museum/btizz-grave-battle-duo.webp', label: 'Battle view' },
  { src: '/museum/btizz-grave-photo-cutout.webp', label: 'Close-up' },
];

// Stylised catalogue illustrations, never presented as photos of the sale item.
export default function MuseumArt({ item, photo, imageIndex = 0 }: { item: MuseumItem; photo?: string | null; imageIndex?: number }) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const validPhoto = photo && (/^https:\/\//.test(photo) || /^\/(?!\/)/.test(photo));
  const referenceImage = item.name === 'Trojan Condom' ? '/museum/trojan-condom-battle-cutout.webp' : item.name === 'Tymeless Lime' ? '/museum/tymeless-lime-battle-duo.webp' : item.name === 'Key Stage 2 English Revision Sheets' ? (revisionSheetPhotos[imageIndex] ?? revisionSheetPhotos[0]).src : item.name === 'Key Stage 2 Mathematics Sheet' ? '/museum/key-stage-mathematics-sheet-cutout.webp' : item.name === 'K.I.M.E Sheet' ? '/museum/key-stage-revision-sheets-kime-cutout.webp' : item.name === 'Fake Beard' ? '/museum/fake-beard-cutout.webp' : item.name === 'K.I.M.E baby shoes' ? '/museum/kime-baby-shoes-battle-cutout.webp' : item.name === 'A jar of Marmalade' ? '/museum/marmalade-jar-battle-duo.webp' : item.name === 'Pink handbag' ? '/museum/pink-handbag-battle-cutout.webp' : item.name === "Google Maps screenshot of Btizz's modest family home" ? '/museum/btizz-home-battle-duo.webp' : item.name === 'Mock headstone photograph bearing Btizz’s name' ? (gravePhotos[imageIndex] ?? gravePhotos[0]).src : item.name === 'Adoption papers presented to prove Deeno was going to “father” Btizz' ? '/museum/btizz-adoption-papers-battle-cutout.webp' : null;
  const name = item.name.toLowerCase();
  const lime = /lime|lemon/.test(name);
  const moustache = /moustache/.test(name);
  const shoes = /shoes|socks/.test(name);
  const board = /flip board/.test(name);
  const Icon = /screenshot|messages/.test(name) ? Smartphone : /photo/.test(name) ? Image : /paper|document/.test(name) ? FileText : /keys/.test(name) ? KeyRound : /handbag/.test(name) ? ShoppingBag : /toothbrush/.test(name) ? Brush : /marmalade|listerine/.test(name) ? FlaskConical : /noodle/.test(name) ? Utensils : /football/.test(name) ? Circle : Package;
  return <div className="gbay-art">
    {validPhoto && failedPhoto !== photo ? <img src={photo} alt={item.name} loading="lazy" onError={() => setFailedPhoto(photo)} /> : referenceImage ? <img src={referenceImage} alt={item.name === 'Trojan Condom' ? 'Performer holding the condom wrapper during the battle' : item.name === 'A jar of Marmalade' ? 'Two performers with the marmalade jar held up during the battle' : item.name === 'Pink handbag' ? 'Performer holding the pink handbag during the battle' : item.name === "Google Maps screenshot of Btizz's modest family home" ? 'Two performers with the house print held up during the battle' : item.name === 'Mock headstone photograph bearing Btizz’s name' ? (imageIndex === 1 ? 'Close-up of the printed mock headstone photo' : 'Performer holding up the mock headstone photo during the battle') : item.name === 'Adoption papers presented to prove Deeno was going to “father” Btizz' ? 'Performer holding the adoption papers during the battle' : item.name === 'Fake Beard' ? 'Tymeless wearing the Fake Beard during the battle' : item.name === 'Tymeless Lime' ? 'Two battle participants with the lime held up' : item.name === 'Key Stage 2 English Revision Sheets' ? `Performer holding ${revisionSheetPhotos[imageIndex]?.label ?? 'Sheet 1'} during the battle` : item.name === 'Key Stage 2 Mathematics Sheet' ? 'Performer holding the Mathematics sheet during the battle' : item.name === 'K.I.M.E Sheet' ? 'Performer holding the K.I.M.E sheet during the battle' : item.name === 'K.I.M.E baby shoes' ? 'Performer holding the K.I.M.E baby shoes and box during the battle' : `Reference image of ${item.name}`} loading="lazy" /> : <>
      <svg className="gbay-illustration" viewBox="0 0 300 240" role="img" aria-label={`Illustration of ${item.name}`}>
        <ellipse cx="150" cy="208" rx="83" ry="9" fill="#161616" opacity=".08" />
        {lime ? <g transform="rotate(-18 150 120)"><circle cx="150" cy="120" r="73" fill={name.includes('lemon') ? '#e8bc21' : '#4e882c'} /><circle cx="150" cy="120" r="65" fill="#f4f0be" /><circle cx="150" cy="120" r="57" fill={name.includes('lemon') ? '#f2d85b' : '#a5c459'} />{Array.from({ length: 8 }, (_, i) => <path key={i} d="M150 120 L150 63" stroke="#f6f2ce" strokeWidth="5" transform={`rotate(${i * 45} 150 120)`} />)}<circle cx="150" cy="120" r="8" fill="#fbf6dc" /></g>
          : moustache ? <g><path d="M150 120 C120 75 97 97 78 113 C62 127 52 124 43 110 C39 147 85 169 118 151 C133 144 143 134 150 125 C162 145 191 163 217 153 C247 145 260 128 257 110 C247 126 235 126 222 113 C199 92 178 79 150 120Z" fill="#25221f" /><path d="M151 120 C128 100 110 110 91 124 M162 124 C186 103 201 111 217 125" fill="none" stroke="#57514b" strokeWidth="3" strokeLinecap="round" /></g>
          : shoes ? <g transform="rotate(-12 150 140)"><path d="M49 92 L109 86 L127 133 L166 153 Q181 164 176 184 L52 184 Q36 174 39 158Z" fill="#a58cae" /><path d="M39 169 L178 169 L176 186 L43 186Z" fill="#faf9f5" stroke="#cec7d1" /><path d="M107 117 L128 117 M112 129 L139 129 M119 141 L148 141" stroke="#faf9f5" strokeWidth="6" /><path d="M151 65 L211 59 L227 106 L264 126 Q279 137 274 157 L151 157 Q134 147 139 131Z" fill="#7b5d86" /><path d="M139 142 L276 142 L274 159 L144 159Z" fill="#faf9f5" stroke="#cec7d1" /><path d="M209 90 L230 90 M214 102 L241 102 M221 114 L250 114" stroke="#faf9f5" strokeWidth="6" /></g>
          : board ? <g><path d="M94 197 L116 76 M206 197 L184 76 M150 173 L150 216" stroke="#b99b73" strokeWidth="7" /><path d="M79 40 H221 V173 H79Z" fill="#fffdfa" stroke="#c8c1b5" strokeWidth="2" /><path d="M79 40 H221 V54 H79Z" fill="#323232" /><path d="M103 84 H198 M103 103 H178 M103 122 H191 M103 141 H169" stroke="#d9d5cd" strokeWidth="3" /></g>
          : <g><rect x="69" y="38" width="162" height="162" rx="2" fill="#fff" stroke="#dedbd6" /><Icon x="100" y="71" width="100" height="100" color={/handbag/.test(name) ? '#986955' : '#766b5b'} strokeWidth="1.2" /></g>}
      </svg>
      <span className="gbay-art-label">Prop illustration</span>
    </>}
  </div>;
}
