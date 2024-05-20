<template>
    <div class="banner-container">
      <div class="banner-title-wrapper">
        <h3 class="banner-title container">Descubra</h3>
      </div>
      <div class="grid-banner container">
        <div class="card first">
          <nuxt-icon name="discover/best" />
          <div class="card__title">Mais Vendidos</div>
        </div>
        <div class="card">
          <nuxt-icon name="discover/appliances" />
          <div class="card__title">Eletrodomésticos</div>
        </div>
        <div class="card">
          <nuxt-icon name="discover/tools" />
          <div class="card__title">Ferramentas</div>
        </div>
        <div class="card">
          <nuxt-icon name="discover/clothing" />
          <div class="card__title">Moda</div>
        </div>
        <div class="card">
          <nuxt-icon name="discover/construction" />
          <div class="card__title">Construção</div>
        </div>
        <div class="card">
          <nuxt-icon name="discover/sports" />
          <div class="card__title">Esportes</div>
        </div>
        <div class="card">
          <nuxt-icon name="discover/car-accessories" />
          <div class="card__title">Acessórios p/ Veículos</div>
        </div>
      </div>
    </div>
  </template>
  
  <style lang="scss" scoped>
  .banner-container {
    width: 100%;
    background-color: #f1f1f1;
    padding-bottom: 32px;
  }
  
  .banner-title {
    font-size: 24px;
    font-weight: 500;
    line-height: 150%;
    margin-bottom: 10px;
  }
  
  .grid-banner {
    display: grid;
    gap: 20px;
    width: 100%;
    overflow-wrap: break-word;
  
    .card {
      display: flex;
      justify-content: center;
      gap: 16px;
      padding: 21px 33px;
      align-items: center;
      background-color: #fdac6c;
      color: white;
      font-size: 24px;
      transition: all 0.2s linear;
      border-radius: 16px;
      cursor: pointer;
      text-align: center;
      font-size: 18px;
      
      &.first {
          flex-direction: column;
          font-size: 24px;
      }
  
      &:hover {
        background-color: darken(#fdac6c, 10%);
      }
    }
  }
  
  /* Responsive layout */
  @media (min-width: 1201px) {
    .grid-banner {
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(2, 1fr);
  
      .card.first {
        grid-row: span 2;
        grid-column: span 2;
      }
    }
  }
  
  @media (max-width: 1200px) and (min-width: 769px) {
    .grid-banner {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto;
      overflow-wrap: anywhere;

      .card {
        flex-direction: column;
        &__title {
            text-align: center;
        }
      }
  
      .card.first {
        grid-column: span 3;
        grid-row: auto;
      }
    }
  }
  
  @media (max-width: 768px) and (min-width: 481px) {
    .grid-banner {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto;
      overflow-wrap: anywhere;
  
      .card {
        flex-direction: column;
        &__title {
            text-align: center;
        }
      }
  
      .card.first {
        grid-column: span 2;
        grid-row: auto;
      }
    }
  }
  
  @media (max-width: 480px) {
    .grid-banner {
      grid-template-columns: 1fr;
      grid-template-rows: auto;

      .card {
        flex-direction: row;
        justify-content: start;
        &__title {
            text-align: left;
        }
      }
  
      .card.first {
        grid-column: span 1;
        grid-row: auto;
      }
    }
  }
  </style>
  