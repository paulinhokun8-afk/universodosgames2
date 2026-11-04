
const API_URL = "https://jsonplaceholder.typicode.com/posts";


const articles = [
  {
    title: "A importância da saúde preventiva",
    body: "A saúde preventiva envolve hábitos saudáveis e consultas periódicas para ajudar a identificar possíveis problemas de saúde.",
    category: "Prevenção"
  },
  {
    title: "A importância de uma boa alimentação",
    body: "Uma alimentação equilibrada fornece nutrientes importantes para o funcionamento do organismo e contribui para a saúde.",
    category: "Nutrição"
  },
  {
    title: "Como cuidar da saúde do coração",
    body: "Praticar atividades físicas, ter uma alimentação equilibrada e acompanhar a pressão arterial são atitudes importantes para a saúde cardiovascular.",
    category: "Cardiologia"
  },
  {
    title: "A importância do sono",
    body: "Dormir bem ajuda na recuperação do organismo, na memória e no funcionamento adequado do corpo.",
    category: "Bem-estar"
  },
  {
    title: "A importância da hidratação",
    body: "A água participa de diversas funções do organismo. Manter uma boa hidratação é essencial para a saúde.",
    category: "Saúde"
  },
  {
    title: "Conhecendo a saúde mental",
    body: "A saúde mental faz parte do bem-estar geral. Cuidar das emoções e procurar ajuda profissional quando necessário é importante.",
    category: "Psicologia"
  },
  {
    title: "A importância da atividade física",
    body: "A prática regular de atividades físicas pode contribuir para a saúde dos músculos, ossos e coração.",
    category: "Qualidade de vida"
  },
  {
    title: "A importância das vacinas",
    body: "As vacinas ajudam a proteger as pessoas contra diversas doenças e contribuem para a saúde coletiva.",
    category: "Imunização"
  },
  {
    title: "Cuidados com a saúde da pele",
    body: "A higiene e a proteção solar são cuidados importantes para manter a saúde da pele.",
    category: "Dermatologia"
  },
  {
    title: "A importância dos exames médicos",
    body: "Os exames podem auxiliar os profissionais de saúde na avaliação e no acompanhamento das condições de cada paciente.",
    category: "Medicina"
  }
];


const postsContainer = document.querySelector("#posts-container");

if (postsContainer) {
  const loading = document.querySelector("#loading");

  const getPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const posts = await response.json();

      posts.slice(0, 10).forEach((post) => {
        const article = articles[post.id - 1];

        postsContainer.innerHTML += `
          <div class="post-card">
            <h3>${article.title}</h3>
            <p>${article.body}</p>
            <p><strong>Categoria:</strong> ${article.category}</p>
            <a href="post.html?id=${post.id}">Ler artigo</a>
          </div>
        `;
      });

      loading.classList.add("hide");

    } catch (error) {
      loading.innerText = "Erro ao carregar os artigos.";
    }
  };

  getPosts();
}


const postContainer = document.querySelector("#post-container");

if (postContainer) {
  const loading = document.querySelector("#loading");
  const post = document.querySelector("#post");
  const commentsContainer = document.querySelector("#comments-container");
  const commentForm = document.querySelector("#comment-form");

  const params = new URLSearchParams(window.location.search);
  const postId = Number(params.get("id"));

  
  const getPost = async () => {
    try {
      if (!postId || postId < 1 || postId > 10) {
        throw new Error("Artigo não encontrado");
      }

      const response = await fetch(`${API_URL}/${postId}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar artigo");
      }

      await response.json();

      const article = articles[postId - 1];

      postContainer.innerHTML = `
        <h2>${article.title}</h2>
        <p><strong>Categoria:</strong> ${article.category}</p>
        <p>${article.body}</p>
      `;

      loading.classList.add("hide");
      post.classList.remove("hide");

      getComments();

    } catch (error) {
      loading.innerText = "Não foi possível carregar o artigo.";
    }
  };

  
  const getComments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/${postId}/comments`
      );

      const comments = await response.json();

      commentsContainer.innerHTML = "";

      comments.slice(0, 5).forEach((comment) => {
        commentsContainer.innerHTML += `
          <div class="comment">
            <h4>${comment.email}</h4>
            <p>${comment.body}</p>
          </div>
        `;
      });

    } catch (error) {
      commentsContainer.innerText = "Erro ao carregar comentários.";
    }
  };

  
  commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const body = document.querySelector("#body").value;

    const comment = {
      email: email,
      body: body,
      postId: postId
    };

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/comments",
        {
          method: "POST",
          body: JSON.stringify(comment),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar comentário");
      }

      const newComment = await response.json();

      commentsContainer.innerHTML += `
        <div class="comment">
          <h4>${newComment.email}</h4>
          <p>${newComment.body}</p>
        </div>
      `;

      commentForm.reset();

    } catch (error) {
      alert("Não foi possível enviar o comentário.");
    }
  });

  getPost();
}
