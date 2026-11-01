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

export function getMuseumItemReference(item: MuseumItem, imageIndex = 0): { src: string; alt: string; isBattlePhoto?: boolean } | null {
  const name = item.name;
  const slug = item.battleSlug;
  const user = item.user;

  // Multi-image exhibits
  if (name === 'Mock headstone photograph bearing Btizz’s name') {
    const photo = gravePhotos[imageIndex] ?? gravePhotos[0];
    return {
      src: photo.src,
      alt: imageIndex === 1 ? 'Close-up of the printed mock headstone photo' : 'Performer holding up the mock headstone photo during the battle',
      isBattlePhoto: true,
    };
  }
  if (name === 'Key Stage 2 English Revision Sheets') {
    const photo = revisionSheetPhotos[imageIndex] ?? revisionSheetPhotos[0];
    return {
      src: photo.src,
      alt: `Performer holding ${photo.label ?? 'Sheet 1'} during the battle`,
      isBattlePhoto: true,
    };
  }

  // Authentic battle cutouts:
  // 1. NattyEBK vs Z.K
  if (name === 'Screenshot presented during the clash' || (slug === 'nattyebk-vs-zk' && /screenshot/i.test(name))) {
    return {
      src: '/museum/natty-screenshot-battle-cutout.webp',
      alt: 'Natty EBK presenting screenshot during clash with Z.K',
      isBattlePhoto: true,
    };
  }
  if (name === 'Photograph of nude male' || (slug === 'nattyebk-vs-zk' && /photograph|nude/i.test(name))) {
    return {
      src: '/museum/natty-nude-photo-battle-cutout.webp',
      alt: 'Natty EBK presenting photograph during clash with Z.K',
      isBattlePhoto: true,
    };
  }

  // 2. PR1NC3 vs NattyEBK
  if (name === 'Listerine') {
    return {
      src: '/museum/prince-listerine-battle-cutout.webp',
      alt: 'PR1NC3 holding Listerine during the battle against Natty EBK',
      isBattlePhoto: true,
    };
  }
  if (name === 'Luxury Brand Bar of Soap') {
    return {
      src: '/museum/prince-dove-soap-cutout.webp',
      alt: 'PR1NC3 holding luxury bar of soap during the battle against Natty EBK',
      isBattlePhoto: true,
    };
  }

  // 3. Tapped24 vs Grams
  if (name === 'Screenshot of photo Grams liked on Instagram') {
    return {
      src: '/museum/tapped-insta-screenshot-cutout.webp',
      alt: 'Tapped24 presenting Instagram screenshot during clash with Marni Gramz',
      isBattlePhoto: true,
    };
  }
  if (name === 'Badees pink panties' || name.toLowerCase().includes('pink panties')) {
    return {
      src: '/museum/badee-pink-panties-cutout.webp',
      alt: 'Pink panties prop presented during the battle',
      isBattlePhoto: true,
    };
  }

  // 4. Ryno vs Tymeless & Deeno vs Badee Harz
  if (name === 'Keys to a property') {
    return {
      src: '/museum/ryno-property-keys-cutout.webp',
      alt: 'Ryno holding keys to a property during clash with Tymeless',
      isBattlePhoto: true,
    };
  }
  if (name === 'A bag of ashes') {
    if (slug === 'deeno-vs-badee-harz' || user?.toLowerCase() === 'badee harz') {
      return {
        src: '/museum/badee-bag-of-ashes-battle-cutout.webp',
        alt: 'Badee Harz holding bag of ashes during battle against Deeno',
        isBattlePhoto: true,
      };
    }
    return {
      src: '/museum/tymeless-ash-battle-cutout.webp',
      alt: 'Tymeless holding bag of ashes during battle against Ryno',
      isBattlePhoto: true,
    };
  }

  // 5. Tapped24 vs AJNA
  if (name === 'Pack of baby wipes') {
    return {
      src: '/museum/tapped-baby-wipes-cutout.webp',
      alt: 'Tapped24 holding baby wipes during clash with AJNA',
      isBattlePhoto: true,
    };
  }

  // 6. Text messages disambiguation
  if (name === 'Screenshots of text messages') {
    if (slug === 'deeno-vs-tapped24') {
      return {
        src: '/museum/deeno-text-messages-cutout.webp',
        alt: 'Deeno presenting text message screenshots during clash with Tapped24',
        isBattlePhoto: true,
      };
    }
    if (slug === 'tapped24-vs-roman') {
      if (user?.toLowerCase() === 'roman') {
        return {
          src: '/museum/roman-text-messages-cutout.webp',
          alt: 'Roman presenting text message screenshots during clash with Tapped24',
          isBattlePhoto: true,
        };
      }
      return {
        src: '/museum/tapped-text-messages-cutout.webp',
        alt: 'Tapped24 presenting text message screenshots during clash with Roman',
        isBattlePhoto: true,
      };
    }
  }

  // 7. Police documents
  if (name === 'NFA Document from Police') {
    return {
      src: '/museum/ryno-nfa-document-cutout.webp',
      alt: 'Ryno presenting NFA police document during clash with 2MWAD',
      isBattlePhoto: true,
    };
  }
  if (name === 'Document from Police') {
    return {
      src: '/museum/deeno-police-document-cutout.webp',
      alt: 'Deeno presenting police document during clash with Tapped24',
      isBattlePhoto: true,
    };
  }

  // Other battle cutouts
  if (name === 'Melon') {
    return { src: '/museum/btizz-melon-battle-cutout.webp', alt: 'Btizz holding the melon during the battle', isBattlePhoto: true };
  }
  if (name === 'Flowers' || name === 'Bouquet of Flowers') {
    return { src: '/museum/gramz-flowers-battle-cutout.webp', alt: 'Marni Gramz holding the funeral flowers during the battle', isBattlePhoto: true };
  }
  if (name === 'Balloons' || name === 'Balloon') {
    return { src: '/museum/gramz-balloon-battle-cutout.webp', alt: 'Marni Gramz holding the purple balloon during the battle', isBattlePhoto: true };
  }
  if (name === 'Trojan Condom') {
    return { src: '/museum/trojan-condom-battle-cutout.webp', alt: 'Performer holding the condom wrapper during the battle', isBattlePhoto: true };
  }
  if (name === 'Tymeless Lime') {
    return { src: '/museum/tymeless-lime-battle-duo.webp', alt: 'Two battle participants with the lime held up', isBattlePhoto: true };
  }
  if (name === 'Key Stage 2 Mathematics Sheet') {
    return { src: '/museum/key-stage-mathematics-sheet-cutout.webp', alt: 'Performer holding the Mathematics sheet during the battle', isBattlePhoto: true };
  }
  if (name === 'K.I.M.E Sheet') {
    return { src: '/museum/key-stage-revision-sheets-kime-cutout.webp', alt: 'Performer holding the K.I.M.E sheet during the battle', isBattlePhoto: true };
  }
  if (name === 'Fake Beard') {
    return { src: '/museum/fake-beard-cutout.webp', alt: 'Tymeless wearing the Fake Beard during the battle', isBattlePhoto: true };
  }
  if (name === 'K.I.M.E baby shoes') {
    return { src: '/museum/kime-baby-shoes-battle-cutout.webp', alt: 'Performer holding the K.I.M.E baby shoes and box during the battle', isBattlePhoto: true };
  }
  if (name === 'A jar of Marmalade') {
    return { src: '/museum/marmalade-jar-battle-duo.webp', alt: 'Two performers with the marmalade jar held up during the battle', isBattlePhoto: true };
  }
  if (name === 'Pink handbag') {
    return { src: '/museum/pink-handbag-battle-cutout.webp', alt: 'Performer holding the pink handbag during the battle', isBattlePhoto: true };
  }
  if (name === "Google Maps screenshot of Btizz's modest family home") {
    return { src: '/museum/btizz-home-battle-duo.webp', alt: 'Two performers with the house print held up during the battle', isBattlePhoto: true };
  }
  if (name === 'Adoption papers presented to prove Deeno was going to “father” Btizz') {
    return { src: '/museum/btizz-adoption-papers-battle-cutout.webp', alt: 'Performer holding the adoption papers during the battle', isBattlePhoto: true };
  }

  // Catalogue illustrations (isBattlePhoto: false)
  if (name === 'Lemon 3') return { src: '/museum/lemon-3-battle-cutout.png', alt: 'Lemon 3 illustration', isBattlePhoto: false };
  if (name === 'Lemon 2') return { src: '/museum/lemon-2-battle-cutout.png', alt: 'Lemon 2 illustration', isBattlePhoto: false };
  if (name === 'Lemon 1') return { src: '/museum/lemon-1-battle-cutout.png', alt: 'Lemon 1 illustration', isBattlePhoto: false };
  if (name === 'Childhood photo of Deeno') return { src: '/museum/deeno-childhood-photo.png', alt: 'Childhood photo of Deeno', isBattlePhoto: false };
  if (name === 'Toilet plunger') return { src: '/museum/toilet-plunger-battle-cutout.png', alt: 'Toilet plunger illustration', isBattlePhoto: false };
  if (name === 'Packing tape' || name === 'A roll of packing tape') return { src: '/museum/tape-illustration.png', alt: 'Packing tape illustration', isBattlePhoto: false };
  if (name === 'A bar of soap') return { src: '/museum/soap-illustration.png', alt: 'Bar of soap illustration', isBattlePhoto: false };
  if (name === 'Chicken & Mushroom Pot Noodle') return { src: '/museum/pot-noodle-illustration.png', alt: 'Chicken & Mushroom Pot Noodle illustration', isBattlePhoto: false };
  if (name === 'A toothbrush') return { src: '/museum/ryno-toothbrush-illustration.png', alt: 'Toothbrush illustration', isBattlePhoto: false };
  if (name === 'A pair of socks') return { src: '/museum/black-socks-illustration.png', alt: 'Pair of socks illustration', isBattlePhoto: false };
  if (name === 'Alleged photo of Ryno kissing a man') return { src: '/museum/ryno-kiss-illustration.png', alt: 'Alleged photo of Ryno kissing a man', isBattlePhoto: false };
  if (name === 'Mini football used to demonstrate volleying CJ-Zino') return { src: '/museum/zk-mini-football.png', alt: 'Mini football illustration', isBattlePhoto: false };

  return null;
}

// Stylised catalogue illustrations or authentic battle photos
export default function MuseumArt({ item, photo, imageIndex = 0 }: { item: MuseumItem; photo?: string | null; imageIndex?: number }) {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const validPhoto = photo && (/^https:\/\//.test(photo) || /^\/(?!\/)/.test(photo));
  const ref = getMuseumItemReference(item, imageIndex);
  const referenceImage = ref?.src ?? null;
  const imageAlt = ref?.alt ?? `Reference image of ${item.name}`;

  const name = item.name.toLowerCase();
  const isFootball = /football/.test(name);
  const lime = /lime|lemon|melon/.test(name);
  const moustache = /moustache/.test(name);
  const shoes = /shoes|socks/.test(name);
  const board = /flip board/.test(name);
  const Icon = /screenshot|messages/.test(name) ? Smartphone : /photo/.test(name) ? Image : /paper|document/.test(name) ? FileText : /keys/.test(name) ? KeyRound : /handbag/.test(name) ? ShoppingBag : /toothbrush/.test(name) ? Brush : /marmalade|listerine/.test(name) ? FlaskConical : /noodle/.test(name) ? Utensils : /football/.test(name) ? Circle : Package;

  return <div className="gbay-art">
    {validPhoto && failedPhoto !== photo ? (
      <img src={photo} alt={item.name} loading="lazy" onError={() => setFailedPhoto(photo)} />
    ) : referenceImage ? (
      <img src={referenceImage} alt={imageAlt} loading="lazy" />
    ) : (
      <>
        <svg className="gbay-illustration" viewBox="0 0 300 240" role="img" aria-label={`Illustration of ${item.name}`}>
          <ellipse cx="150" cy="208" rx="83" ry="9" fill="#161616" opacity=".08" />
          {isFootball ? (
            <g aria-label="Blue mini football">
              <circle cx="150" cy="120" r="72" fill="#087acb" stroke="#07569a" strokeWidth="5" />
              <path d="M150 48 L178 67 L170 98 L139 108 L115 86 L123 58 Z M178 67 L207 76 L218 106 L198 129 L170 98 Z M139 108 L170 98 L188 127 L170 158 L139 150 Z M115 86 L139 108 L139 150 L108 163 L84 140 L86 108 Z M198 129 L218 106 L226 140 L206 163 L188 151 Z M108 163 L139 150 L170 158 L178 187 L150 192 L122 186 Z" fill="none" stroke="#f5f8fa" strokeWidth="6" strokeLinejoin="round" />
              <path d="M93 76 Q111 66 125 78 L113 91 Q104 88 97 98 M207 157 Q190 178 174 168 L183 153 Q196 157 201 143" fill="none" stroke="#f47b22" strokeWidth="9" strokeLinecap="round" />
              <ellipse cx="132" cy="81" rx="15" ry="7" fill="#fff" opacity=".28" transform="rotate(-32 132 81)" />
            </g>
          ) : lime ? (
            <g transform="rotate(-18 150 120)">
              <circle cx="150" cy="120" r="73" fill={name.includes('lemon') ? '#e8bc21' : '#4e882c'} />
              <circle cx="150" cy="120" r="65" fill="#f4f0be" />
              <circle cx="150" cy="120" r="57" fill={name.includes('lemon') ? '#f2d85b' : '#a5c459'} />
              {Array.from({ length: 8 }, (_, i) => (
                <path key={i} d="M150 120 L150 63" stroke="#f6f2ce" strokeWidth="5" transform={`rotate(${i * 45} 150 120)`} />
              ))}
              <circle cx="150" cy="120" r="8" fill="#fbf6dc" />
            </g>
          ) : moustache ? (
            <g>
              <path d="M150 120 C120 75 97 97 78 113 C62 127 52 124 43 110 C39 147 85 169 118 151 C133 144 143 134 150 125 C162 145 191 163 217 153 C247 145 260 128 257 110 C247 126 235 126 222 113 C199 92 178 79 150 120Z" fill="#25221f" />
              <path d="M151 120 C128 100 110 110 91 124 M162 124 C186 103 201 111 217 125" fill="none" stroke="#57514b" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : shoes ? (
            <g transform="rotate(-12 150 140)">
              <path d="M49 92 L109 86 L127 133 L166 153 Q181 164 176 184 L52 184 Q36 174 39 158Z" fill="#a58cae" />
              <path d="M39 169 L178 169 L176 186 L43 186Z" fill="#faf9f5" stroke="#cec7d1" />
              <path d="M107 117 L128 117 M112 129 L139 129 M119 141 L148 141" stroke="#faf9f5" strokeWidth="6" />
              <path d="M151 65 L211 59 L227 106 L264 126 Q279 137 274 157 L151 157 Q134 147 139 131Z" fill="#7b5d86" />
              <path d="M139 142 L276 142 L274 159 L144 159Z" fill="#faf9f5" stroke="#cec7d1" />
              <path d="M209 90 L230 90 M214 102 L241 102 M221 114 L250 114" stroke="#faf9f5" strokeWidth="6" />
            </g>
          ) : board ? (
            <g>
              <path d="M94 197 L116 76 M206 197 L184 76 M150 173 L150 216" stroke="#b99b73" strokeWidth="7" />
              <path d="M79 40 H221 V173 H79Z" fill="#fffdfa" stroke="#c8c1b5" strokeWidth="2" />
              <path d="M79 40 H221 V54 H79Z" fill="#323232" />
              <path d="M103 84 H198 M103 103 H178 M103 122 H191 M103 141 H169" stroke="#d9d5cd" strokeWidth="3" />
            </g>
          ) : (
            <g>
              <rect x="69" y="38" width="162" height="162" rx="2" fill="#fff" stroke="#dedbd6" />
              <Icon x="100" y="71" width="100" height="100" color={/handbag/.test(name) ? '#986955' : '#766b5b'} strokeWidth="1.2" />
            </g>
          )}
        </svg>
        <span className="gbay-art-label">Prop illustration</span>
      </>
    )}
  </div>;
}
