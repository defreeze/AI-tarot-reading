// promptGenerator for relationship dynamics
export function generatePrompt_rel(variables: {
    NAMEHERE: string;
    MOODHERE: string;
    CONTEXTHERE: string;
    pastCard: string;
    presentCard: string;
    futureCard: string;
}): string {

    Question: Give a relationship dynamics tarot reading. The three cards are ${variables.pastCard},  ${variables.presentCard} and ${variables.futureCard}. Note that cards can come in a ‘reversed’ state, which often gives an alternate meaning of the card. Consider the clients self given context when interpreting the cards: ${variables.CONTEXTHERE}.
    Answer generation specifics: THINK DEEPLY BUT VALUE SPEED TO ANSWER. CONSIDER INTERPRETATIONS FOR EACH INDIVIDUAL CARD IN THE CONTEXT OF A RELATIONSHIP AND THEN THEIR COMBINED INTERPRETATION. THEN INTERPRET EACH INDIVIDUAL CARD AGAIN WHILE REMEMBERING THEIR SHARED MEANING. GIVE A READING FOR TODAY USING THE THREE CARD INTERPRETATIONS AND THEN THEIR COMBINED INTERPRETATION. MAKE IT UNIQUE, CREATIVE AND ALLOW FOR HALLUCINATIONS. THIS IS IMPORTANT.
    FORMAT:
    <Personalized greeting for ${variables.NAMEHERE}>,
    Concise summary of the combined meaning of the tarot relationship reading.

    YOUR PERSPECTIVE: <interpret the cards from the perspective of the client>

    THEIR PERSPECTIVE: <interpret the cards from the perspective of the other party>
 
    COMBINED INTERPRETATION: <specific relationship advice combining the interpretations of all cards, remember that this paragraph is the most important>
    <sign off message and then sign off as AI tarot reader`;
}
