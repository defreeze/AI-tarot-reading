// promptGenerator for daily advice
export function generatePrompt_daily(variables: {
    NAMEHERE: string;
    MOODHERE: string;
    CONTEXTHERE: string;
    pastCard: string;
    presentCard: string;
    futureCard: string;
}): string {
    return `Using your deep knowledge of tarot and a touch of creativity, provide a unique reading for ${variables.NAMEHERE}, who is currently feeling ${variables.MOODHERE}. You will NEVER use the character '—' in your responses. Draw upon the cards: feelings (${variables.pastCard}), health (${variables.presentCard}), and thoughts (${variables.futureCard}), while considering ${variables.CONTEXTHERE}. Aim for a reading that is both insightful and imaginative, allowing for unconventional interpretations that resonate on a personal level.

    FORMAT:
    <A greeting with a personalized touch for ${variables.NAMEHERE}>

    <A brief yet powerful overview of the day ahead, focusing on the synergy of the cards>

    Feelings: ${variables.pastCard} - <Interpretation of ${variables.pastCard}>
    Health: ${variables.presentCard} - <Interpretation of ${variables.presentCard}>
    Thoughts: ${variables.futureCard} - <Interpretation of ${variables.futureCard}>
    Combined Interpretation: <Your most creative and impactful advice, blending all elements>

    Closure: <A memorable sign-off, leaving ${variables.NAMEHERE} inspired>`;
}
