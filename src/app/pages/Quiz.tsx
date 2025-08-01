import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export default function Quiz() {
    const [loading, setLoading] = useState(false);
    const [quizLink, setQuizLink] = useState<string | null>(null);
    const [noteContent, setNoteContent] = useState<string | null>(null);

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
                invoke<string>('read_file', { filepath: selected }).then(content => {
                    setNoteContent(content)
                });
                console.log('Fichier sélectionné:', selected);
            }
        } catch (error) {
            console.error('Erreur lors de la sélection du fichier:', error);
        }
    };

    return (
        <div>
            <button
                onClick={handleSelectFile}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-5"
            >
                Choisissez une note
            </button>
            <button
                onClick={handleGenerateQuiz}
                disabled={loading || !noteContent}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                {loading ? "Génération..." : "Créer un Quiz"}
            </button>
            {quizLink && (
                <p className="mt-2 text-foreground">
                    ✅ Quiz créé ! <a href={quizLink}>Voir le quiz</a>
                </p>
            )}
        </div>
    );
}
