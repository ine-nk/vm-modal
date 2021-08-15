// тут будет сама разработка
let fruits = [
  {
    id: 1,
    title: 'Яблоки',
    price: 20,
    img: 'https://e1.edimdoma.ru/data/recipes/0014/1746/141746-ed4_wide.jpg?1628761928'
  },
  {
    id: 2,
    title: 'Апельсины',
    price: 30,
    img: 'https://chef.ru/wp-content/uploads/oranges-273024_1920.jpg'
  },
  {
    id: 3,
    title: 'Манго',
    price: 40,
    img: 'https://itsfresh.ru/upload/iblock/178/178d8253202ef1c7af13bdbd67ce65cd.jpg'
  },
]

/**
 * 1. Динамически на основе массива вывести список карточек
 * 2. показать цену в модалке ( 1-я модалка) по кнопке показать
 * 3. Модалка для удаления с 2-мя кнопками
 * -------------------------------------------------------
 * 4. на основе плагина $.modal надо сделать другой плагин $.confitm (Promise)
 *
 * */

const priceModal = $.modal({
  title: 'Цена на товар',
  closable: true,
  content: `
        <h4>Modal is working</h4>
        <p>Lorem ipsum dolor sit.</p>`,
  width: '400px',
  footerButtons: [
    {
      text: 'Закрыть', type: 'primary', handler() {
        // console.log('Primary button clicked ')
        priceModal.close()
      }
    },
    // {
    //     text: 'Cancel', type: 'danger', handler() {
    //         console.log('Danger  button clicked ')
    //         priceModal.close()
    //     }
    // },
  ]
})

/**
 const confirmModal = $.modal({
    title: 'Вы уверены???',
    closable: true,
    width: '400px',
    footerButtons: [
        {
            text: 'Отменить', type: 'secondary', handler() {
                // console.log('Primary button clicked ')
                confirmModal.close()
            }
        },
        {
            text: 'Удалить', type: 'danger', handler() {
                console.log('Danger  button clicked ')
                confirmModal.close()
            }
        },
    ]
})
 */
function removeEls(el) {
  const delEls = document.querySelectorAll(el)
  delEls.forEach(delEl => delEl.remove())
}

// const container = document.querySelector('.container')
// const row = document.createElement('div')
// row.classList.add('row')
// row.dataset.id='fruits'

const toHTML = fruit =>
    `<div class="col">
        <div class="card">
            <img class="card-img-top" style="heigth: 300px;" src="${fruit.img}" alt="${fruit.title}" />
            <div class="card-body">
                <h5 class="card-title">${fruit.title}</h5>
                <a href="#" class="btn btn-primary" data-id="${fruit.id}" data-btn="price" >Посмотреть цену</a>
                <a href="#" class="btn btn-danger" data-id="${fruit.id}" data-btn="remove" >Удалить</a>
            </div>    
        </div>
    </div>
    `


function render() {
  // const html = fruits.map(fruit => toHTML(fruit))
  // после map получаем массив строк которые соединяем через join('')
  const html = fruits.map(toHTML).join('')

  document.querySelector('#fruits').innerHTML = html
}

render()

document.addEventListener('click', event => {
  event.preventDefault()
  const btnType = event.target.dataset.btn
  const id = +event.target.dataset.id

  if (btnType === 'price') {

  const fruit = fruits.find((f => f.id === id))
    console.log('попали в btnLook ================',)
    priceModal.setContent(`<h5>${fruit.title}</h5>
        <p>цена  <strong>${fruit.price}$</strong></p>`)
    console.log('fruit = ', fruit)
    priceModal.open()

  } else if (btnType === 'remove') {
    // confirmModal.setContent(`<p>Вы удаляете фрукт: <strong>${fruits[id].title}</strong></p>`)
    // confirmModal.open()
    const fruit = fruits.find((f => f.id === id))
      console.log(id)

    $.confirm({
      title: 'Вы уверены???',
      content: `<p>Вы удаляете фрукт: <strong>${fruit.title}</strong></p>`,
    }).then(() => {
      console.log('remove')
      fruits = fruits.filter(f => f.id !== id)
      console.log(fruits)
      render()
    }).catch(() => {
      console.log('Cancel = Отмена')
    })

  }
})

// $.modal()

// $.modal() - такая запись говорит что это будет плагин у объекта вызываем метод

