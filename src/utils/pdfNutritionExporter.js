import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function pdfNutritionExporter(nutritionPlan, user) {
  if (!nutritionPlan) return;

  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString("pt-PT");

  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("Plano de Nutrição Personalizado", 105, 20, { align: "center" });

  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${currentDate}`, 105, 28, { align: "center" });

  // Add user info if available
  if (user) {
    doc.text(`Utilizador: ${user.displayName || user.email}`, 20, 38);
  }

  // Add nutrition plan details
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  let yPosition = 48;

  doc.text(`Plano: ${nutritionPlan.name}`, 20, yPosition);
  yPosition += 7;

  if (nutritionPlan.description) {
    doc.setFontSize(10);
    const splitDescription = doc.splitTextToSize(
      nutritionPlan.description,
      170
    );
    doc.text(splitDescription, 20, yPosition);
    yPosition += splitDescription.length * 5 + 5;
  }

  // Calculate totals from foods
  const calculateTotals = () => {
    if (!nutritionPlan?.alimentos || nutritionPlan.alimentos.length === 0) {
      return {
        total_calories: nutritionPlan?.total_calories || 0,
        total_proteins: nutritionPlan?.total_proteins || 0,
        total_carbs: nutritionPlan?.total_carbs || 0,
        total_fats: nutritionPlan?.total_fats || 0,
      };
    }

    let totals = {
      total_calories: 0,
      total_proteins: 0,
      total_carbs: 0,
      total_fats: 0,
    };

    nutritionPlan.alimentos.forEach((food) => {
      const quantity = food.AlimentosPlano?.quantity || 100;
      const multiplier = quantity / (food.serving_size || 100);

      totals.total_calories += (food.calories || 0) * multiplier;
      totals.total_proteins += (food.protein || 0) * multiplier;
      totals.total_carbs += (food.carbs || 0) * multiplier;
      totals.total_fats += (food.fat || 0) * multiplier;
    });

    return totals;
  };

  const macros = calculateTotals();

  // Add macros summary
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  yPosition += 5;
  doc.text("Resumo de Macronutrientes", 20, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.text(`Calorias: ${Math.round(macros.total_calories)} kcal`, 20, yPosition);
  yPosition += 6;
  doc.text(`Proteína: ${Math.round(macros.total_proteins)}g`, 20, yPosition);
  yPosition += 6;
  doc.text(`Carboidratos: ${Math.round(macros.total_carbs)}g`, 20, yPosition);
  yPosition += 6;
  doc.text(`Gordura: ${Math.round(macros.total_fats)}g`, 20, yPosition);
  yPosition += 10;

  // Add foods table
  const foods = nutritionPlan.alimentos || [];

  if (foods.length > 0) {
    const tableData = foods.map((food) => {
      const quantity = food.AlimentosPlano?.quantity || 100;
      const multiplier = quantity / (food.serving_size || 100);

      return [
        food.name,
        `${quantity}g`,
        Math.round(food.calories * multiplier),
        `${Math.round(food.protein * multiplier)}g`,
        `${Math.round(food.carbs * multiplier)}g`,
        `${Math.round(food.fat * multiplier)}g`,
      ];
    });

    autoTable(doc, {
      startY: yPosition,
      head: [["Alimento", "Quantidade", "Calorias", "Proteína", "Carbos", "Gordura"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [0, 123, 255],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
      },
    });
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      "FitFetch - Plano de Nutrição",
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  doc.save(`plano-nutricao-${currentDate.replace(/\//g, "-")}.pdf`);
}
