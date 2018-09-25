(function () {
    class Dragadrop {
        constructor(id, options, drag, drop, close, refresh) {
            this.id = id;
            this.root = null;
            this.items = [];
            this.cursor = 'auto';
            this.refreshId = null;

            this.options = options;

            this.move = {};
            this.target = {};

            this.randomBgColor = true;
            this.hoverShadow = true;
            this.hoverCallBack = null;
            this.flurCallBack = null;
            this.columns = null;
            this.defColumns = null;
            this.itemHeight = null;
            this.itemWidth = null;
            this.dragadrop = true;
            this.background = null;
            this.tools = true;
            this.closeCSS = '';
            this.refreshCSS = '';
            this.loadingClass = null;
            this.errorHtmlContainer = null;

            this.callBackDragContainerID = drag;
            this.callBackDropContainerID = drop;
            this.callBackClose = close;
            this.callBackRefreshHandler = refresh;
        }

        setLoading(containerID, isLoad) {
            if (!this.loadingClass) {
                return;
            }
            const container = $(`#${containerID}`);
            if (isLoad) {
                container.addClass(this.loadingClass);
            } else {
                container.removeClass(this.loadingClass);
            }
        }

        getNumColumns() {
            return this.defColumns;
        }

        setItemsSize(number) {
            this.setItemsHeight(number);
            this.setItemsWidth(number);
        }

        enabledDragadrop(enable) {
            this.dragadrop = Boolean(enable);
            this.cursorAuto();
        }

        setItemsHeight(number) {
            this.validateNumber(number);
            this.getItems().forEach(item => item.height(number));
            this.itemHeight = number;
        }

        setItemsWidth(number) {
            this.validateNumber(number);
            this.getItems().forEach(item => item.width(number));
            this.itemWidth = number;
        }

        validateNumber(number) {
            if (typeof number != 'number') {
                throw 'Parameter must be nubmer';
            }
        }

        getItems() {
            return this.items;
        }

        init(options, drag, drop, close, refresh) {
            if (this.root === null) {
                this.root = $(`#${this.id}`);
                this.initialRootStyle();
            }

            if (!this.options) {
                this.options = options;
            }

            if (!this.callBackDragContainerID) {
                this.callBackDragContainerID = drag;
            }

            if (!this.callBackDropContainerID) {
                this.callBackDropContainerID = drop;
            }

            if (!this.callBackClose) {
                this.callBackClose = close;
            }

            if (!this.callBackRefreshHandler) {
                this.callBackRefreshHandler = refresh;
            }


            this.getElemntRoot().onmousedown = () => {
                if (!this.dragadrop) {
                    return;
                }

                this.cursorMove();
                if (this.callBackDragContainerID) {
                    this.callBackDragContainerID(this.target.id);
                }
            };

            this.getElemntRoot().onmouseup = () => {
                if (!this.dragadrop || (this.target.id === this.move.id)) {
                    return;
                }

                this.cursorAuto();
                this.swapVideo();
                if (this.callBackDropContainerID) {
                    this.callBackDropContainerID(this.target.id, this.move.id);
                }
            };

            this.initialOption();
        }

        swapVideo() {
            const targetId = this.target.id;
            const moveId = this.move.id;
            if (targetId !== moveId) {
                const targetContainer = $(`#${targetId}`);
                const moveContainer = $(`#${moveId}`);
                const targetHtml = targetContainer.html();

                targetContainer.html(moveContainer.html());
                moveContainer.html(targetHtml);
            }
        }

        initialRootStyle() {
            this.getRoot().css('display', 'grid');
            this.getRoot().css('grid-template-columns', 'auto');
            this.getRoot().css('grid-template-rows', 'auto');
            this.getRoot().css('grid-auto-flow', 'row');
            this.getRoot().css('overflow', 'auto');
        }

        initialOption() {
            for (const key in this.options) {
                this[key] = this.options[key];
            }
        }

        getRootSenchaStrID() {
            return `${this.id}-innerCt`;
        }

        getElemntRoot() {
            return document.getElementById(this.getRootSenchaStrID());
        }

        getRoot() {
            return $(`#${this.getRootSenchaStrID()}`);
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
            this.getRoot().html('');
            this.updateGrid();
        }

        addContainer(options) {
            const id = this.generateRandomId();
            const htmlContainer = this.getHtmlContainer(id);
            this.getRoot().append(htmlContainer);
            const appendItem = $(`#${id}`);

            if (this.itemHeight) {
                appendItem.height(this.itemHeight);
            }

            if (this.itemWidth) {
                appendItem.width(this.itemWidth);
            }

            this.items.push(appendItem);

            this.updateGrid();
            this.bindListenersContainer(id);

            if (this.randomBgColor) {
                appendItem.css('background-color', this.generateRandomColor());
            }

            if (this.background) {
                appendItem.css('background-color', this.background);
            }

            return {
                containerId: id
            };
        }

        bindListenersContainer(id) {
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

            this.bindCloseHandler(`${id}-tools-close`);
            this.bindRefreshHandler(`${id}-tools-refresh`, id);
        }

        cursorMove() {
            this.cursor = 'move';
            this.getRoot().css('cursor', 'move');
        }

        cursorAuto() {
            this.cursor = 'auto';
            this.getRoot().css('cursor', 'auto');
        }

        setColumns(number) {
            this.validateNumber(number);
            this.columns = number;
            this.updateGrid();
        }

        updateGrid() {
            const cssRows = {
                3: 2,
                5: 3,
                13: 4,
                21: 5,
                31: 6,
                41: 7,
                51: 8,
                61: 9
            };

            this.defColumns = this.columns ? this.columns : cssRows[this.items.length];

            let css = '';

            for (let i = 0; i < this.defColumns; i++) {
                css += 'auto ';
            }

            if (css) {
                this.getRoot().css('grid-template-columns', css);
            }
        }

        getHtmlContainer(id) {
            const style = `${this.itemHeight ? this.itemHeight : ''}${this.itemWidth ? this.itemWidth : ''}`;
            return `<div id="${id}" style="display: flex; height: auto; margin: 1%; flex-direction: column; justify-content: center; ${style ? style : ''}">
                       ${this.tools ? this.getToolsHtml(id) : ''}
                       ${this.errorHtmlContainer ? this.errorHtmlContainer : ''}
                    </div>`;
        }

        setWidth(id, width) {
            $(`#${id}`).css('width', width);
        }

        setHeight(id, height) {
            $(`#${id}`).css('height', height);
        }

        setErrorHtmlContainer(html) {
            this.errorHtmlContainer = html;
        }

        getToolsHtml(containerID) {
            return `<div style="padding-right: 4px;"><div style="display: flex; width: 100%; justify-content: flex-end; flex-direction: row; padding-right: 10px; padding-left: 10px">
                        <p id="${containerID}-tools-header" style="flex: 1; color: #fff; font-weight: 600; font-size: 20px"></p>
                        <p id="${containerID}-tools-refresh" containerID="${containerID}" style="cursor: pointer; align-self: flex-end; color: #fff; margin-right: 3%;" class="${this.refreshCSS}">${this.refreshCSS ? '' : 'refresh'}</p>
                        <p id="${containerID}-tools-close" containerID="${containerID}" style="cursor: pointer; align-self: flex-end; color: #fff" class="${this.closeCSS}">${this.closeCSS ? '' : 'close'}</p>
                        
                    </div></div>`
        }

        setHeaderVideoContainer(containerID, html) {
            $(`#${containerID}-tools-header`).html(html);
        }

        deleteItem(containerID) {
            const el = $(`#${containerID}`);
            el.remove();
            this.items = this.items.filter(item => item[0].id != el[0].id);
            if (this.callBackClose) {
                this.callBackClose(containerID);
            }
        }

        bindCloseHandler(id) {
            const el = $(`#${id}`);
            el.bind( "click", () => this.deleteItem(el.attr('containerID')));
        }

        bindRefreshHandler(toolsId, containerId) {
            const el = $(`#${toolsId}`);
            el.bind( "click", () => {
                if(this.callBackRefreshHandler) {
                    this.callBackRefreshHandler(toolsId, containerId);
                }
            });
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
    window.drag = new Dragadrop();
})();
