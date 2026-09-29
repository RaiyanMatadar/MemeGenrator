import { useEffect, useState } from "react"
import { ImagePlus, LoaderCircle, Shuffle, Sparkles } from "lucide-react"

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "https://i.imgflip.com/1bij.jpg"
    })
    const [allMemes, setAllMemes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        const controller = new AbortController()

        fetch("https://api.imgflip.com/get_memes", { signal: controller.signal })
            .then(response => {
                if (!response.ok) throw new Error("Could not load templates")
                return response.json()
            })
            .then(data => {
                if (!data.success) throw new Error("Could not load templates")
                setAllMemes(data.data.memes)
            })
            .catch(error => {
                if (error.name !== "AbortError") setLoadError(true)
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false)
            })

        return () => controller.abort()
    }, [])

    function handleChange(event) {
        const { value, name } = event.currentTarget
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }

    function toggleRandomImage() {
        if (allMemes.length === 0) return
        const choices = allMemes.filter(template => template.url !== meme.imageUrl)
        const randomIndex = Math.floor(Math.random() * choices.length)
        setMeme(previous => ({ ...previous, imageUrl: choices[randomIndex].url }))
    }

    function selectTemplate(template) {
        setMeme(previous => ({ ...previous, imageUrl: template.url }))
    }

    return (
        <main className="studio">
            <section className="editor-panel" aria-labelledby="editor-title">
                <div className="section-heading">
                    <span className="eyebrow">01 / THE EDITOR</span>
                    <h2 id="editor-title">Set the scene.</h2>
                    <p>A little context goes a long way.</p>
                </div>

                <div className="form">
                    <label htmlFor="topText">
                        <span className="field-label"><span>Top line</span><span className="field-position">TOP</span></span>
                    <input
                        id="topText"
                        type="text"
                        placeholder="Add your opening line"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                    </label>

                    <label htmlFor="bottomText">
                        <span className="field-label"><span>Bottom line</span><span className="field-position">BOTTOM</span></span>
                    <input
                        id="bottomText"
                        type="text"
                        placeholder="Land the punchline"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                    </label>
                </div>

                <div className="template-heading">
                    <span className="field-label">Pick a template</span>
                    <span className="template-count">{allMemes.length ? `${allMemes.length} to explore` : "IMGFLIP LIBRARY"}</span>
                </div>
                <div className="template-grid" aria-label="Meme templates">
                    {allMemes.slice(0, 6).map(template => (
                        <button
                            className={`template-option${meme.imageUrl === template.url ? " is-selected" : ""}`}
                            key={template.id}
                            type="button"
                            onClick={() => selectTemplate(template)}
                            aria-label={`Use ${template.name} template`}
                            aria-pressed={meme.imageUrl === template.url}
                        >
                            <img src={template.url} alt="" loading="lazy" />
                        </button>
                    ))}
                    {isLoading && <div className="template-message"><LoaderCircle size={17} className="spin" /> Loading templates</div>}
                    {!isLoading && loadError && <p className="template-message">Templates are unavailable right now.</p>}
                </div>

                <button className="surprise-button" onClick={toggleRandomImage} disabled={isLoading || allMemes.length === 0}>
                    <Shuffle size={17} strokeWidth={2.2} />
                    <span>Surprise me</span>
                    <span className="button-shortcut"><Sparkles size={15} /></span>
                </button>
                <p className="editor-footnote">A fresh template, same great punchline.</p>
            </section>

            <section className="preview-panel" aria-labelledby="preview-title">
                <div className="preview-heading">
                    <div>
                        <span className="eyebrow">02 / THE PREVIEW</span>
                        <h2 id="preview-title">The big reveal.</h2>
                    </div>
                    <span className="live-indicator"><span /> LIVE</span>
                </div>
                <div className={`meme-stage${imageError ? " is-empty" : ""}`}>
                    {!imageError ? (
                        <div className="meme">
                            <img src={meme.imageUrl} alt="Selected meme template" onLoad={() => setImageError(false)} onError={() => setImageError(true)} />
                            <span className="top">{meme.topText}</span>
                            <span className="bottom">{meme.bottomText}</span>
                        </div>
                    ) : (
                        <div className="image-fallback">
                            <ImagePlus size={30} />
                            <p>This template couldn't load.</p>
                            <button onClick={toggleRandomImage} disabled={allMemes.length === 0}>Try another</button>
                        </div>
                    )}
                    <span className="stage-index">MEME STUDIO <span>•</span> 2026</span>
                </div>
                <div className="preview-caption">
                    <span>YOUR CANVAS</span>
                    <span>Changes show up instantly</span>
                </div>
            </section>
        </main>
    )
}