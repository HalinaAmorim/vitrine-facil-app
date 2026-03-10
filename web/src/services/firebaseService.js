// src/services/firebaseService.js (Mock atualizado para o novo visual)

export const firebaseService = {
    getLojas: async () => {
      // Simulando o Firebase por enquanto com dados compatíveis com o novo layout visual
      return [
        {
          id: "1",
          nome: "Carlos Silva",
          nomeLoja: "Padaria Doce Pão",
          segmento: "Alimentação",
          cidade: "Centro",
          // Adicionando imagem de capa para o novo visual
          imagemCapa: "https://images.unsplash.com/photo-1711672284661-bd70e38f31b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        },
        {
          id: "2",
          nome: "Ana Souza",
          nomeLoja: "Moda & Estilo",
          segmento: "Vestuário",
          cidade: "Jardins",
          imagemCapa: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        },
        {
          id: "3",
          nome: "Roberto Ramos",
          nomeLoja: "Tech Store",
          segmento: "Eletrônicos",
          cidade: "Vila Nova",
          imagemCapa: "https://images.unsplash.com/photo-1571857089849-f6390447191a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        }
      ];
    }
  };