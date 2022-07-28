import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import instructionsPath from './instructions.md'

const Home = () => {
    const [instructions, setInstructions] = useState<string>()

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(instructionsPath)
            const markdownText = await response.text()
            setInstructions(markdownText)
        }
        fetchData()
    }, [])

    if (!instructions) {
        return null
    }

    return <ReactMarkdown children={instructions} />
}

export default Home
