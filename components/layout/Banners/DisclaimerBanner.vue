<template>
  <div class="banner-container">
    <div class="container">
      <div class="banner-premium">
        <picture class="banner-premium__figure">
          <source srcset="http://via.placeholder.com/400x400" media="(max-width: 540px)">
          <img
            src="http://via.placeholder.com/700x250"
            alt="Desa Shop Premium"
          />
        </picture>
        <figcaption class="banner-premium__figcaption">
          <div class="banner-title">
            Acelere seu Negócio com o Desa Shop Premium
            <span class="premium-icon"> <nuxt-icon name="premium" /></span>
          </div>
          <div class="banner-description">
            Quer vender mais rápido? Com o Desa Shop Premium você terá seu
            produto na página principal do nosso site, para que mais pessoas
            tenham acesso ao seu anúncio!
          </div>
        </figcaption>
      </div>
      <div class="banner-shipping">
        <picture class="banner-shipping__figure">
          <source srcset="http://via.placeholder.com/400x400" media="(max-width: 540px)">
          <img
            src="http://via.placeholder.com/700x250"
            alt="Desa Shop Premium"
          />
        </picture>
        <figcaption class="banner-shipping__figcaption">
          <div class="banner-title">Como funciona nossa entrega?</div>
          <div class="banner-description">
            Nossos clientes podem escolher entre pegar a mercadoria diretamente
            com o vendedor ou através de entrega por transportadora ou Correios
          </div>
        </figcaption>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner-container {
  width: 100%;
  background-color: #f1f1f1;
  padding-block: 32px;
  .container {
    display: flex;
    align-items: stretch;
    gap: 20px;
    justify-content: center;
    @media screen and (max-width: 991px) {
        flex-direction: column;
    }
    .banner-shipping, .banner-premium {
        width: 100%;
        picture {
            img {
                border-radius: 5px;
            }
        }
        figcaption {
            .banner-title {
                font-size: 20px;
                font-weight: 500;
                margin-block: 8px;
                .premium-icon {
                    color: #3AA8F8;
                }
            }
            .banner-description {
                color: #5c615f;
                font-size: 14px;
                line-height: 120%;
            }
        }
    }
  }
}
</style>