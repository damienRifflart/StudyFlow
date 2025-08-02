import { invoke } from "@tauri-apps/api/core";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";

export default function Quiz() {
    const [loading, setLoading] = useState(false);
    const [quizLink, setQuizLink] = useState<string | null>(null);
    const [noteContent, setNoteContent] = useState<string | null>(null);
    const [filePath, setFilePath] = useState<string | null>(null)

    const handleGenerateQuiz = async () => {
        try {
            setLoading(true);
            setQuizLink(null);

            // génération via OpenAI
            const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content:
                                "Tu es un générateur de quiz pour MongoDB. Réponds uniquement avec un objet JSON valide sans texte autour.",
                        },
                        {
                            role: "user",
                            content: `À partir de ce texte : 
${noteContent}

Génère un objet JSON au format suivant (aucun texte en dehors du JSON) :
{
  "title": "Titre du quiz",
  "content": {
    "1": {
      "question": "...",
      "answers": ["...", "...", "...", "..."],
      "correctAnswers": [0]
    },
    "2": {
      "question": "...",
      "answers": ["...", "...", "...", "..."],
      "correctAnswers": [0]
    },
    "3": {
      "question": "...",
      "answers": ["...", "...", "...", "..."],
      "correctAnswers": [0]
    },
    "4": {
      "question": "...",
      "answers": ["...", "...", "...", "..."],
      "correctAnswers": [0]
    },
    "5": {
      "question": "...",
      "answers": ["...", "...", "...", "..."],
      "correctAnswers": [0]
    }
  },
  "category": "Sports" ou "Histoire" ou "Musique" ou "Jeux vidéo" ou "Science" ou "Autre" ,
  "level": {1 ou 2},
}

- Génère 5 questions avec 4 réponses chacune.
- Tu peux mettre plusieurs réponses correctes si tu le veux.
- Remplace toutes les clés et types par ceux donnés.
`,
                        },
                    ],
                }),
            });

            const aiData = await aiRes.json();
            const parsedQuiz = JSON.parse(aiData.choices[0].message.content);

            // envoi à Quizzlify par l'api
            const res = await fetch("https://quizzlify.vercel.app/api/create-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    author: "StudyFlow",
                    title: parsedQuiz.title,
                    created_at: new Date(),
                    content: parsedQuiz.content,
                    category: parsedQuiz.category,
                    level: parsedQuiz.level,
                    status: "published"
                }),
            });

            const data = await res.json();
            if (data.success) {
                setQuizLink(`https://quizzlify.vercel.app/quiz/${data.quizId}`);
            }
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFile = async () => {
        try {
            const selected = await invoke('plugin:dialog|open', {
                options: {
                    directory: false,
                    multiple: false,
                    title: 'Choisir une note sur laquelle créer un quiz.',
                }
            });

            if (selected && typeof selected === 'string') {
                setFilePath(selected);
                invoke<string>('read_file', { filepath: selected }).then(content => {
                    setNoteContent(content)
                });;
            }
        } catch (error) {
            console.error('Erreur lors de la sélection du fichier:', error);
        }
    };

    return (
        <div className="w-full px-6 mt-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Quiz</h1>
            <p className="text-lg mb-8 max-w-2xl">
                Transformez vos notes en quiz interactifs et testez vos connaissances.
                Grâce à l'API de <a href="https://quizzlify.vercel.app" target="_blank" className="text-accent hover:underline">Quizzlify</a>{" "}
                et à celle d'OpenAI, profitez d'une génération intelligente de questions pour apprendre plus rapidement.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {/* Étape 1 */}
                <div className="p-6 bg-card rounded-2xl shadow-md border border-border">
                    <h3 className="text-xl font-semibold mb-3">1. Choisissez une note</h3>
                    <p className="mb-4">Sélectionnez une de vos notes pour générer un quiz adapté.</p>
                    <button
                        onClick={handleSelectFile}
                        className="w-full py-3 px-4 rounded-xl bg-secondary font-medium"
                    >
                        Choisir une note
                    </button>

                    {filePath && (
                        <p
                            className="mt-4 overflow-hidden font-medium text-ellipsis"
                            style={{
                                direction: "rtl",
                                textAlign: "left",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {filePath}
                        </p>
                    )}
                </div>

                {/* Étape 2 */}
                <div className="p-6 bg-card rounded-2xl shadow-md border border-border">
                    <h3 className="text-xl font-semibold mb-3">2. Créez votre quiz</h3>
                    <p className="mb-2">Générez un quiz intelligent basé sur votre note.</p>
                    <p className="mb-4 flex items-center text-orange-500">
                        <TriangleAlert size={37} className="mr-2" />
                            L’approbation de votre quiz par un administrateur de quizzlify peut prendre jusqu’à 7 jours.
                    </p>

                    <button
                        onClick={handleGenerateQuiz}
                        disabled={loading || !noteContent}
                        className={"w-full py-3 px-4 rounded-xl font-medium bg-secondary"}
                    >
                        {loading ? "Génération..." : "Créer un Quiz"}
                    </button>

                    {quizLink && (
                        <p className="mt-4 text-green-600 font-medium">
                            ✅ Quiz créé !{" "}

                            <a href={quizLink} className="hover:underline">
                                Voir le quiz
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

}
