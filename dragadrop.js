$(document).ready(() => {
   class Dragadrop {
       constructor(id) {
           this.id = id;
           this.root = $(`#${id}`);
           this.items = [];
           this.cursor = 'auto';
           this.move = {};
           this.target = {};
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

           $(`#${id}`).css('background-color', this.generateRandomColor());
       }

       bindListener(id) {
           const root = $('#root');
           const container = $(`#${id}`);
           container.mousedown(() => {
               root.css('cursor', 'move');
               this.cursor = 'move';
               this.move = {
                   id: id,
                   color: container.css('background-color')
               }
           }).on('mouseover', () => {
               if (this.cursor === 'move') {
                   this.target = {
                       id: id,
                       color: container.css('background-color')
                   };
                   container.css('box-shadow', '-5px 0px 30px rgba(0,0,0,0.5)');
               }
           }).on('mouseout', () => container.css('box-shadow', ''));
           root.mouseup(() => {
               root.css('cursor', 'auto');
               this.cursor = 'auto';
               const moved = $(`#${this.move.id}`);
               const target = $(`#${this.target.id}`);

               moved.css('background-color', this.target.color);
               target.css('background-color', this.move.color);
           });
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

       getHtmlContainer(id, orientation) {
           return `<div id="${id}"></div>`;
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

   window.drag = new Dragadrop('root');
});