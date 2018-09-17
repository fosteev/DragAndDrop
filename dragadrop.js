$(document).ready(() => {
    class Dragadrop {
        constructor(id, options, drag, drop) {
            this.id = id;
            this.root = $(`#${id}`);
            this.items = [];
            this.cursor = 'auto';

            this.options = options;

            this.move = {};
            this.target = {};

            this.randomBgColor = true;
            this.hoverShadow = true;
            this.hoverCallBack = null;
            this.flurCallBack = null;

            this.callBackDragContainerID = drag;
            this.callBackDropContainerID = drop;

            this.init();
            this.test(15);
        }

        init() {
            document.onmousedown = () => {
                this.cursorMove();
                if (this.callBackDragContainerID) {
                    this.callBackDragContainerID(this.target.id);
                }
            };

            document.onmouseup = () => {
                this.cursorAuto();
                if (this.callBackDropContainerID) {
                    this.callBackDropContainerID(this.move.id);
                }
            };
            this.initialOption();
        }

        initialOption() {
            for (const key in this.options) {
                this[key] = this.options[key];
            }
        }

        getRoot() {
            return this.root;
        }

        getEl(el) {
            return $(`#${el[0].id}`);
        }

        test(count) {
            for (let i = 0; i < count; i++) {
                this.addContainer();
            }
        }

        clear() {
            this.items = [];
            $('#root').html('');
            this.updateGrid();
        }

        addContainer(options) {
            const id = this.generateRandomId();
            const container = this.getHtmlContainer(id);

            this.root.append(container);
            this.items.push(container);

            this.updateGrid();
            this.bindListener(id);

            if (this.randomBgColor) {
                $(`#${id}`).css('background-color', this.generateRandomColor());
            }
        }

        bindListener(id) {
            const container = document.getElementById(id);
            const jqContainer = $(`#${id}`);

            container.onmousedown = () => {
                this.move = {
                    id: id,
                };
            };

            container.onmousemove = (e) => {
                if (this.cursor === 'move') {
                    this.target = {
                        id: id
                    };

                    if (this.hoverShadow) {
                        jqContainer.css('box-shadow', '-5px 0px 30px rgba(0,0,0,0.5)');
                    }

                    if (this.hoverCallBack) {
                        this.hoverCallBack(id, container, jqContainer);
                    }

                }
            };

            container.onmouseleave = (e) => {
                if (this.hoverShadow) {
                    jqContainer.css('box-shadow', '');
                }

                if (this.flurCallBack) {
                    this.flurCallBack(id, container, jqContainer);
                }
            };
        }

        cursorMove() {
            this.cursor = 'move';
            this.getRoot().css('cursor', 'move');
        }

        cursorAuto() {
            this.cursor = 'auto';
            this.getRoot().css('cursor', 'auto');
        }

        updateGrid() {
            const cssRows = {
                3: 'auto auto',
                5: 'auto auto auto',
                13: 'auto auto auto auto',
                21: 'auto auto auto auto auto',
                31: 'auto auto auto auto auto auto',
                41: 'auto auto auto auto auto auto auto',
                51: 'auto auto auto auto auto auto auto auto',
                61: 'auto auto auto auto auto auto auto auto auto'
            };

            const css = cssRows[this.items.length];

            if (css) {
                this.root.css('grid-template-rows', css);
            }
        }

        getHtmlContainer(id) {
            return `<div id="${id}" class="container"></div>`;
        }

        generateRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        generateRandomId() {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }
    };

    window.drag = new Dragadrop('root', {
        randomBgColor: false
    }, id => {
        console.log(`drag ${id}`);
    }, id => {
        console.log(`drop ${id}`);
    });
});