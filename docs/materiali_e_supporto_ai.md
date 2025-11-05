Linee Guida per Codice di Alta Qualità Generato con AI Companion
 
Prompt di Riferimento (Fornito dall'Utente):
 
Agisci come Senior Software Architect e Senior Prompt Engineer: analizza la docuementazione e produci un prompt che guidi un agente LLM per il coding di questo progetto che usi tutte le buone pratiche di sviluppo come ad esempio il TDD e proceda passo per passo utilizzando git e un file in cui tiene traccia di cosa deve fare, cosa sta facendo, cosa ha completato.

 
L'obiettivo di questo progetto è la replica ad alta fedeltà del videogioco arcade originale Pac-Man (Namco, 1980), che richiede l'implementazione esatta di meccaniche complesse (IA dei fantasmi, tempistiche). L'uso di un AI Companion (strumento di supporto alla scrittura del codice) è benvenuto, a condizione che il codice generato sia trattato come bozza e sottoposto a un rigoroso processo di revisione umana (Human-in-the-loop).
Le seguenti linee guida stabiliscono il processo per garantire che il codice assistito dall'AI soddisfi gli standard tecnici richiesti per una replica fedele.
 
1.  Integrazione e Allineamento del Contesto
 
Prima di accettare qualsiasi codice, è fondamentale allineare l'output dell'AI Companion con le specifiche del progetto.
1.1. Inclusione dei Requisiti (Prompting):
Fornire all'AI Companion, quando possibile, frammenti rilevanti dei documenti (analisi_tecnica.md e prd.md) come contesto esplicito nel prompt.
Esempio: per l'IA di Pinky, citare sempre il requisito del "bug originale".
1.2. Trattare il Codice come Bozza:
Mai accettare il codice generato dall'AI senza una revisione umana approfondita. L'AI eccelle nel codice standard (boilerplates) ma può mancare la logica aziendale complessa e le specificità architetturali.
Il codice deve risolvere il requisito specifico del prodotto, e non solo un'interpretazione tecnica del prompt.
1.3. Conformità allo Stack Tecnologico:
Verificare che il codice generato rispetti lo stack definito: HTML5 (<canvas>), CSS3, JavaScript (ES6+), Nessun Framework di gioco.
 
2.  Revisione del Codice (Code Review) Potenziata
 
Il processo di Code Review deve essere intensificato per il codice generato dall'AI, focalizzandosi su logica e integrazione.
 
2.1. Validazione della Logica di Gioco e Funzionalità
 
Validazione della Logica: Verificare che l'IA dei fantasmi e le meccaniche di Pac-Man (es. input buffering, collisioni tile-based) corrispondano esattamente ai requisiti.
Focus Critico: L'implementazione dell'IA di Pinky (bug originale, targeting 4 tile avanti) e Inky (imboscata a pinza, vettore basato su Blinky e Pac-Man) deve essere controllata al pixel/tile.
Test Unitari: Mandatario l'uso dell'AI per generare test unitari sul codice critico (es. calcolo della posizione target dei fantasmi), prima della generazione del codice di implementazione.
Integrazione del Game Loop: Assicurarsi che le funzioni generate si integrino correttamente nel Game Loop Engine basato su requestAnimationFrame (target 60 FPS), responsabile di chiamare la logica di aggiornamento e rendering.
 
2.2. Standard e Qualità del Codice
 
Chiarezza e Manutenzione: Il codice deve essere pulito, ben commentato e minimizzare la complessità. L'AI è uno strumento utile per far rispettare la coerenza di stile.
Consistenza: Garantire che gli standard di formattazione, denominazione e convenzioni (es. uso del State Manager centrale) siano coerenti.
Prestazioni: Verificare che il codice non introduca bottleneck che compromettano l'obiettivo dei 60 FPS, specialmente nel Rendering Engine che utilizza l'elemento <canvas>.
 
3.  Mitigazione dei Rischi Specifici dell'AI
 
3.1. Revisione dell'Impatto Architetturale:
Valutare come il codice generato si integra con l'architettura esistente, in particolare i componenti chiave (AI Engine, State Manager, Input Handler). Garantire l'aderenza ai principi di separazione delle preoccupazioni (Separation of Concerns).
3.2. Priorità ai Dettagli Tecnici:
Dare priorità alle verifiche sul funzionamento preciso delle meccaniche:
Timing delle modalità dei fantasmi (Scatter/Chase/Frightened) basato sul timer di livello.
Logica di Clyde (cambio di comportamento a 8 tile di distanza).
Input buffering di Pac-Man per le svolte ("cornering").