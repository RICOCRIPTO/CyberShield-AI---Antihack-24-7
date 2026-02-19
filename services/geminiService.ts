
import { GoogleGenAI, Type } from "@google/genai";

// Always use named parameter for apiKey and obtain it directly from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSecurityLog = async (logs: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise estes logs de sistema simulados e determine se há atividade suspeita. Responda de forma curta e técnica: ${logs.join(' | ')}`,
      config: {
        systemInstruction: "Você é um especialista em cibersegurança focado em detecção de intrusão.",
      }
    });
    return response.text || "Nenhuma ameaça detectada nos logs recentes.";
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return "Falha ao conectar com o motor de IA.";
  }
};

export const getBreachProtocol = async (): Promise<{ summary: string, steps: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "O sistema foi invadido! Forneça um protocolo de emergência imediato para o usuário.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Resumo curto do perigo." },
            steps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Passos numerados de ação imediata."
            }
          },
          required: ["summary", "steps"]
        }
      }
    });
    
    // Accessing .text property directly instead of text() method.
    return JSON.parse(response.text || '{"summary": "Ameaça Crítica!", "steps": ["Desligar Wi-Fi", "Modo Avião", "Desligar Máquina"]}');
  } catch (error) {
    return {
      summary: "PROTOCOLO DE EMERGÊNCIA ATIVADO",
      steps: [
        "Ligue o Modo Avião imediatamente.",
        "Desconecte todos os cabos de rede.",
        "Desligue o computador pressionando o botão power por 10 segundos.",
        "Procure assistência técnica especializada."
      ]
    };
  }
};
