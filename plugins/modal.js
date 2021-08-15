// работа  с прототипами - для прототипа Elements  надо добавить функцию которая вставляет сформированный
// элемент после указанного
Element.prototype.appendAfter = function (element){
    element.parentNode.insertBefore(this, element.nextSibling);
}

// пустая функция которая ничего не делает - для того чтобы не было ошибки
function  noop(){

}

function  _createModalFooter(buttons = []){
    if(buttons.length === 0){
        return document.createElement('div')
    }
    const wrap =document.createElement('div')
    wrap.classList.add('modal-footer')

    buttons.forEach(btn=>{
        const $btn = document.createElement('button')
        $btn.classList.add('btn')
        $btn.classList.add(`btn-${btn.type || 'secondary'}`)
        $btn.textContent = btn.text
        $btn.onclick = btn.handler || noop

        wrap.appendChild($btn)
    })

    return wrap
}

// по итогу мы должны получить инстанс модального окна который будет обладать различными методами
function _createModal(options) {
    const DEFAULT_WIDTH = '600px'
    const modal = document.createElement('div')
    modal.classList.add('vmodal')
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-overlay" data-close="true">
            <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
                <div class="modal-header">
                    <span class="modal-title">${options.title || 'модальное окно'}</span>
                    ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''} 
                </div>
                <div class="modal-body" data-content>
                    ${options.content || 'content is empty'}
                </div>
<!--                <div class="modal-footer">-->
<!--                    <button>Ok</button>-->
<!--                    <button>Cancel</button>-->
<!--    -->
<!--                </div>-->
            </div>
        </div>
   `)
    const footer = _createModalFooter(options.footerButtons) // получаем node футера
    footer.appendAfter(modal.querySelector('[data-content]'))
    document.body.appendChild(modal)
    return modal
}

/**
 *  заверстать title: string
 *  closable: true  - то крести показывается
 *              false - то крести не показывается
 *  content: string - то наполнение которое попадает в модальное окно
 *  width: 400px; (string) - указывать ширину модального окна
 *  destroy(): void - метод который удаляет модальное окно и удаляет всех слушателей
 *  при нажатии на крестик модальное окно должно закрываться и
 *      при клике на серое поле МО тоже долнжно закрываться
 *  публичный метод - setContent(html : string): void | PUBLIC (ничего не будет возвращать)
 *  ( с помощью этого метода динамичски будет изменяться содержимое модального окна)
 * ------------------------------------
 *
 *  хуки:
 *  onOpen(): void -
 *  onClose(): void - вызывается когда окно зарыто
 *  beforeClose(): boolean - ? true - тогда модально окно можно закрыть,
 *                          ? false  - тогда окно нельзя закрыть
 *  Animate.css
 * */


$.modal = function (options) {
    // константа - скорость анимации
    const ANIMATION_SPEED = 200

    // создаем приватную переменную и обозначаем что это DOM элемент $
    const $modal = _createModal(options)
    let closing = false
    let destroyed = false

    const modal = {
        open() {
            if (destroyed) {
                return console.log('Modal is destoyed')
            }
            !closing && $modal.classList.add('open')
        },
        close() {
            closing = true
            $modal.classList.remove('open')
            $modal.classList.add('hide')
            setTimeout(() => {
                $modal.classList.remove('hide')
                closing = false
                // если метод onClose присутствует в опциях и это функция  тогда мы его вызываем
                if(typeof options.onClose === 'function'){
                    options.onClose()
                }
            }, ANIMATION_SPEED)
        },
    }

    //для более простого удаления слушателя функция добавления прослушки
    const listener = event => {
        if (event.target.dataset.close) {
            modal.close()
        }
    }

    // так объект modal уже создан то на него можно навешать прослушку и вызвать сформированный
    // выше метод close() через добавление listener
    $modal.addEventListener('click', listener)

// так как объект разрушения должен быть публичным (должен быть сделать экспорт)
// при  return мы добавляем к modal  еще метод  destroy()
//  добавляем метод setContent()
    return Object.assign(modal, {
        // удаление модального окна чтобы не разрасталось приложение
        destroy() {
            // удаление объекта $modal из DOM дерева через обращение к родительскому объекту
            // из него удаляем $modal
            // и удаляем назначенную  прослушку
            $modal.parentNode.removeChild($modal)
            $modal.removeEventListener('click', listener)
            destroyed = true
        },
        // помещаем в div с классом  modal-body и атрибутом data-content
        setContent(html){
            $modal.querySelector('[data-content]').innerHTML = html

        }
    })
}