import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export default function PdfExportButton({ userProfile, weeklyMenu, shoppingList }) {
  const exportPdf = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Menu Hebdomadaire Personnalisé', 14, 16);

    // Profil utilisateur
    doc.setFontSize(12);
    doc.text('Profil utilisateur:', 14, 28);
    doc.text(`Âge: ${userProfile.age} ans`, 14, 36);
    doc.text(`Sexe: ${userProfile.sexe}`, 60, 36);
    doc.text(`Taille: ${userProfile.taille} cm`, 14, 44);
    doc.text(`Poids: ${userProfile.poids} kg`, 60, 44);
    doc.text(`Activité: ${userProfile.activite}`, 14, 52);
    if (userProfile.allergies) doc.text(`Allergies: ${userProfile.allergies}`, 14, 60);
    if (userProfile.intolerances) doc.text(`Intolérances: ${userProfile.intolerances}`, 14, 68);
    if (userProfile.preferences) doc.text(`Préférences: ${userProfile.preferences}`, 14, 76);
    doc.text(`IMC: ${(userProfile.poids / ((userProfile.taille/100) ** 2)).toFixed(1)}`, 14, 84);
    doc.text(`Besoin calorique: ${userProfile.besoinCalorique} kcal`, 60, 84);

    // Saut de page pour le menu
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Menu de la semaine', 14, 16);
    const menuRows = weeklyMenu.map((day, idx) => [
      `Jour ${idx+1}`,
      day.petitDej ? day.petitDej.name : '-',
      day.dejeuner ? day.dejeuner.name : '-',
      day.diner ? day.diner.name : '-',
    ]);
    doc.autoTable({
      head: [['Jour', 'Petit-déjeuner', 'Déjeuner', 'Dîner']],
      body: menuRows,
      startY: 24,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [99, 102, 241] },
    });

    // Saut de page pour la liste d'achats
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Liste d\'achats', 14, 16);
    const shopRows = Object.entries(shoppingList.ingredients).map(([ing, count]) => [
      ing, `x${count}`, shoppingList.details[ing].join(', ')
    ]);
    doc.autoTable({
      head: [['Ingrédient', 'Quantité', 'Utilisé pour']],
      body: shopRows,
      startY: 24,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    // Tableau nutritionnel
    let y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Récapitulatif nutritionnel', 14, y);
    const summaryRows = weeklyMenu.map((day, idx) => {
      let cal = 0, prot = 0, gluc = 0, lip = 0, ca = 0, fer = 0;
      ['petitDej', 'dejeuner', 'diner'].forEach(m => {
        const r = day[m];
        if (r) {
          cal += r.calories || 0;
          prot += r.macros.proteines || 0;
          gluc += r.macros.glucides || 0;
          lip += r.macros.lipides || 0;
          ca += r.micronutrients.calcium || 0;
          fer += r.micronutrients.fer || 0;
        }
      });
      return [
        `Jour ${idx + 1}`,
        cal,
        prot,
        gluc,
        lip,
        ca,
        fer,
      ];
    });
    doc.autoTable({
      head: [['Jour', 'Calories', 'Protéines', 'Glucides', 'Lipides', 'Calcium', 'Fer']],
      body: summaryRows,
            ca += r.micronutrients.calcium || 0;
            fer += r.micronutrients.fer || 0;
          }
        });
        return [
          `Jour ${idx + 1}`,
          cal,
          prot,
          gluc,
          lip,
          ca,
          fer,
        ];
      }),
      startY: y + 4,
      styles: { fontSize: 10, cellPadding: 2 },
    });

    // Ajout du résumé hebdomadaire et conseils personnalisés
    if (typeof window !== 'undefined' && window.__menu_summary) {
      let finalY = doc.lastAutoTable.finalY + 8;
      const summary = window.__menu_summary;
      if (summary.resume) {
        doc.setFontSize(11);
        doc.setTextColor(30, 64, 175);
        doc.text(summary.resume, 14, finalY);
        finalY += 8;
      }
      if (summary.conseils && summary.conseils.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(180, 83, 9);
        doc.text('Conseils personnalisés :', 14, finalY);
        finalY += 6;
        doc.setFontSize(9);
        summary.conseils.forEach(c => {
          doc.text('- ' + c, 16, finalY);
          finalY += 5;
        });
        finalY += 2;
      }
    }

    // Ajout des graphiques (nutrition et micronutriments)
    const nutChart = document.querySelector('canvas[id*="nutrition"]');
    const microChart = document.querySelector('canvas[id*="micronutrient"]');
    let chartY = doc.lastAutoTable.finalY + 10;
    if (nutChart) {
      const nutImg = await html2canvas(nutChart).then(canvas => canvas.toDataURL('image/png'));
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Graphique nutritionnel', 14, 18);
      doc.addImage(nutImg, 'PNG', 10, 28, 180, 60);
    }
    if (microChart) {
      const microImg = await html2canvas(microChart).then(canvas => canvas.toDataURL('image/png'));
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Graphique micronutriments', 14, 18);
      doc.addImage(microImg, 'PNG', 10, 28, 180, 60);
    }

    doc.save('menu_hebdomadaire.pdf');
  };

  return (
    <button
      onClick={exportPdf}
      className="px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 mb-6"
    >
      Exporter au format PDF
    </button>
  );
}
