<template>
  <footer class="footer-containers">
    <section class="container footer-content">
      <article class="customer-service">
        <h4 class="article-title">Atendimento ao cliente</h4>
        <ul class="article-list">
          <li class="article-list__item">
            <NuxtLink to="/">Central de Ajuda</NuxtLink>
          </li>
          <li class="article-list__item">
            <NuxtLink to="/">Como comprar</NuxtLink>
          </li>
          <li class="article-list__item">
            <NuxtLink to="/">Métodos de Pagamentos</NuxtLink>
          </li>
          <li class="article-list__item">
            <NuxtLink to="/">Garantia</NuxtLink>
          </li>
          <li class="article-list__item">
            <NuxtLink to="/">Devolução e Reembolso</NuxtLink>
          </li>
          <li class="article-list__item">
            <NuxtLink to="/">Fale Conosco</NuxtLink>
          </li>
        </ul>
      </article>
      <article class="about-us">
        <h4 class="article-title">Sobre Nós</h4>
        <ul class="article-list">
          <li class="article-list__item">
            <NuxtLink to="/">Sobre Nós</NuxtLink>
          </li>
          <li class="article-list__item">
            <NuxtLink to="/">Nossas Políticas</NuxtLink>
          </li>
          <li class="article-list__item">
            <NuxtLink to="/">Política de Privacidade</NuxtLink>
          </li>
          <li class="article-list__item">
            <NuxtLink to="/">Política de Devolução</NuxtLink>
          </li>
          <li class="article-list__item">
            <NuxtLink to="/">Política de Reembolso</NuxtLink>
          </li>
        </ul>
      </article>
      <article class="payment">
        <h4 class="article-title">Pagamento</h4>
        <ul class="article-list">
          <li class="article-list__item">
            <nuxt-icon name="payments/elo" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="payments/visa" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="payments/diners" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="payments/amex" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="payments/pix" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="payments/boleto" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="payments/mastercard" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="payments/hipercard" />
          </li>
        </ul>
      </article>
      <article class="social-media">
        <h4 class="article-title">Redes Sociais</h4>
        <ul class="article-list">
          <li class="article-list__item">
            <nuxt-icon name="social/facebook" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="social/youtube" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="social/tiktok" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="social/instagram" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="social/twitter" />
          </li>
          <li class="article-list__item">
            <nuxt-icon name="social/linkedin" />
          </li>
        </ul>
      </article>
    </section>
    <div class="copy">Desenvolvido com ❤️ por Vinícius e Matheus Vinícius - Todos os Direitos Reservados - 2024</div>
  </footer>
</template>

<style lang="scss" scoped>
.copy {
    width: 100%;
    min-height: 60px;
    background: #111;
    color: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 14px;
    text-align: center;
}
.footer-containers {
    background-color: #222;
    color: white;
}
.footer-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding-block: 32px 100px;
    @media screen and (max-width: 991px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media screen and (max-width: 540px) {
        grid-template-columns: repeat(1, 1fr);
    }
    article {
        display: flex;
        flex-direction: column;
        gap: 16px;
        .article-title {
            font-size: 18px;
            font-weight: 600;
        }
        .article-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            &__item {
                transition: all .2s linear;
                &:hover {
                    transform: translateX(12px);
                    a {
                        color: #d4d4d4;
                    }
                }
                a {
                    color: white;
                    font-weight: 500;
                    line-height: 1;
                    text-decoration: none;
                    font-size: 14px;
                }
            }
        }
        &.payment {
            .article-list {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                width: fit-content;
                &__item {
                    &:hover {
                        transform: initial;
                    }
                    span {
                        width: 64px;
                        position: relative;
                        display: block;
                    }
                }
            }
        }
        &.social-media {
            .article-list {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                width: 100%;
                gap: 12px;
                max-width: fit-content;
                &__item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all .2s linear;
                    border-radius: 5px;
                    cursor: pointer;
                    span {
                        position: relative;
                        width: 48px;
                        display: block;
                    }
                    &:hover {
                        background-color: #f1f1f1;
                        transform: initial;
                    }
                }
            }
        }
    }
}
</style>