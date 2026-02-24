import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function pdfWorkoutExporter(workoutPlan, user, convertToMinutes, tWorkoutType, tLevel) {
    if (!workoutPlan) return;
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString("pt-PT");

    // Add logo to header (PNG, loaded as Image)
    const logoImg = new window.Image();
    logoImg.src = "/img/logos/ff_logo.png";

    logoImg.onload = function () {
        addHeader(true);
        addWorkoutDetailsAndSave();
    };

    // If image fails to load, fallback to PDF without logo
    logoImg.onerror = function () {
        addHeader(false);
        addWorkoutDetailsAndSave();
    };

    function addHeader(withLogo) {
        // Logo at top, smaller size, centered
        let logoWidth = 40; // mm
        let logoHeight = 24; // fallback height
        let logoY = 8;
        if (withLogo) {
            if (logoImg.naturalWidth && logoImg.naturalHeight) {
                // Scale height proportionally to width
                logoHeight = logoImg.naturalHeight * (logoWidth / logoImg.naturalWidth);
            }
            const logoX = (210 - logoWidth) / 2;
            doc.addImage(logoImg, "PNG", logoX, logoY, logoWidth, logoHeight);
        }
        // Title below logo with extra spacing
        const titleY = logoY + logoHeight + 16;
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("Plano de Treino Personalizado", 105, titleY, { align: "center" });

        // Date below title
        const dateY = titleY + 8;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Gerado em: ${currentDate}`, 105, dateY, { align: "center" });

        // User info below date
        const userY = dateY + 10;
        if (user) {
            doc.text(`Utilizador: ${user.displayName || user.email}`, 20, userY);
        }
        // Set details start position for next section
        addHeader.detailsStartY = user ? userY + 10 : dateY + 10;
    }

    function addWorkoutDetailsAndSave() {
        // Add workout details
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        let yPosition = addHeader.detailsStartY || 68;

        const workoutTypeKey = workoutPlan.workoutType || workoutPlan.workout_type;
        const workoutTypeLabel = tWorkoutType[workoutTypeKey] || workoutTypeKey;

        const levelLabel = tLevel[workoutPlan.level] || workoutPlan.level;

        doc.text(`Tipo de treino: ${workoutTypeLabel}`, 20, yPosition);
        yPosition += 7;
        doc.text(`Nível: ${levelLabel}`, 20, yPosition);
        yPosition += 7;

        if (workoutTypeKey !== "cardio") {
            doc.text(
                `Descanso entre séries: ${convertToMinutes(workoutPlan.rest_time)} ${
                    workoutPlan.rest_time < 60 ? "segundos" : "minuto(s)"
                }`,
                20,
                yPosition
            );
            yPosition += 7;

            if (workoutPlan.series_number) {
                doc.text(`Séries: ${workoutPlan.series_number}`, 20, yPosition);
                yPosition += 7;
            }

            if (workoutPlan.reps_number) {
                doc.text(`Repetições: ${workoutPlan.reps_number}`, 20, yPosition);
                yPosition += 7;
            }
        } else if (workoutPlan.duration) {
            doc.text(`Duração: ${workoutPlan.duration} minutos`, 20, yPosition);
            yPosition += 7;
        }

        // Add exercises table
        yPosition += 5;
        const exercises = workoutPlan.exercises || [];

        const tableData = exercises.map((ex) => {
            const difficultyLabel =
                ex.difficulty === "beginner"
                    ? "Iniciante"
                    : ex.difficulty === "intermediate"
                        ? "Intermédio"
                        : "Avançado";

            return [ex.name, ex.muscle_group, difficultyLabel];
        });

        autoTable(doc, {
            startY: yPosition,
            head: [["Exercício", "Músculo", "Dificuldade"]],
            body: tableData,
            theme: "striped",
            headStyles: {
                fillColor: [0, 123, 255],
                textColor: 255,
                fontStyle: "bold",
            },
            styles: {
                fontSize: 10,
                cellPadding: 5,
            },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 60 },
                2: { cellWidth: 50 },
            },
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                "FitFetch - Plano de Treino",
                105,
                doc.internal.pageSize.height - 10,
                { align: "center" }
            );
        }

        // Save the PDF
        doc.save(`plano-treino-${currentDate.replace(/\//g, "-")}.pdf`);
    }
}
