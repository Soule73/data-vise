// Ce fichier permet d'enregistrer les éléments nécessaires de Chart.js pour éviter l'erreur "arc is not a registered element".
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);
