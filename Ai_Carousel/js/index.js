let Slider_Wrapper = document.querySelectorAll('.Slider_Wrapper');
const sliding_duration = 4000;

if (Slider_Wrapper[0] != undefined){

    Slider_Wrapper.forEach((element)=>{
        let timeOutFunctionId = "";
        let InterValId = "";
        let Carouse_Moving = 'Moving';
        let ParentElm = element.parentElement;
        let CMD = -1; /* Carousel Movement Direction */
        let IsTuchDown = false;
        let startX;

        element.addEventListener('mouseenter', () => {
            Carouse_Moving='';
        })
        element.addEventListener('mouseleave', () => {
            Carouse_Moving='Moving';
        })

        // Transition Cards Perticular Time Interval
        const TransitionFunction = ()=>{
            let CWHolder = element.firstElementChild; 
            let CW = CWHolder.firstElementChild;
            CW.addEventListener('transitionend', () => {
                if (CMD == -1){
                    CW.appendChild(CW.firstElementChild);
                }else if (CMD == 1){
                    CW.prepend(CW.lastElementChild);
                }
                CW.style.transition = 'none';
                CW.style.transform = `translatex(${0}px)`;
                setTimeout(()=>{
                    CW.style.transition = 'all 0.5s ease-in-out 0.5s';
                })

                counterParentElm = element.parentElement.children[1]
                if (counterParentElm != undefined){
                    let counterNext;
                    let counterPrevious;
                    if(CMD == -1){
                        let el = CW.children[0].classList[0]
                        counterNext = counterParentElm.children[el]
                        counterPrevious = counterParentElm.children[el-1]
                    }
                    if(CMD == 1){
                        let el = CW.children[1].classList[0]
                        counterNext = counterParentElm.children[el-1]
                        counterPrevious = counterParentElm.children[el]
                    }
                    if (counterNext != undefined){
                        counterNext.classList.add('Slider_Button_Active');
                    }
                    if(counterPrevious != undefined){
                        counterPrevious.classList.remove('Slider_Button_Active');
                    }
                    
                    if(counterNext == undefined & CMD == -1){
                        counterParentElm.lastElementChild.classList.remove('Slider_Button_Active');
                        counterParentElm.firstElementChild.classList.add('Slider_Button_Active');
                    }
                    if(counterPrevious == undefined & CMD == 1){
                        counterParentElm.lastElementChild.classList.add('Slider_Button_Active');
                        // console.warn(counterParentElm.firstElementChild)
                        counterParentElm.firstElementChild.classList.remove('Slider_Button_Active');
                    }
                }
            });
        }
        TransitionFunction();

        const Carousel = ()=>{
            ParentElm = element.parentElement;
            // CONTENT WRAPPER HOLDER (CWHolder)
            let CWHolder = element.firstElementChild; 
            let screenWidth = element.clientWidth;

            // CONTENT WRAPPER (CW)
            let CW = CWHolder.firstElementChild;
            let CWwidth = CW.clientWidth;

            // CONTENT (CNT)
            let CNT = CW.firstElementChild;
            let CNTWidth = CNT.clientWidth;
            let totalCNT = CW.children.length;

            // GAP BETWEEN TWO CARDS
            let gap_between_CNT = (CWwidth-(CNTWidth*totalCNT))/(totalCNT-1)

            // NUMBER OF CARDS DISPLAY ON THE SCREEN
            let CNTdisplaing = Math.ceil(screenWidth/(CNTWidth+(gap_between_CNT/2)))

            /*
            LOGIC: [ HOWMUCH CONTENT-HOLDER MOVEMENT REQUIRE TO DISPLAY ALL CARDS CENTER ACCORDING TO SCREEN WIDTH CHANGE BY MOVING FIRST CARD ONLY ] =>
            A = SCREEN WIDTH, B = CARD WIDTH, C = GAP BETWEEN TWO CARDS, D = HOW MANY CARDS DISPLAYING
            move = ((D x B) + (C x (D - 1))-A)/2
            */
            xMove = (((CNTdisplaing * CNTWidth) + gap_between_CNT*(CNTdisplaing-1)) -screenWidth)/2
            
            // First-time Move Carousel
            const moveCarousel = () =>{
                let move = CNTWidth + gap_between_CNT
                if (Carouse_Moving=='Moving' & CMD == -1){
                    CW.style.transform = `translatex(${-move}px)`;
                }else if (Carouse_Moving=='Moving' & CMD == 1){
                    CW.style.transform = `translatex(${move}px)`;
                }
            }

            // DETECTING TOUCH
            element.addEventListener('touchstart', (e)=>{
                IsTuchDown = true;
                Carouse_Moving='';
                let touch = e.touches[0]
                startX = touch.pageX - element.offsetLeft;
            }, { passive: true })

            element.addEventListener('touchend', () => {
                IsTuchDown = false;
                Carouse_Moving='Moving';
            }, { passive: true })

            element.addEventListener('touchmove', (e)=>{
                Carouse_Moving='';
                if(!IsTuchDown) return;
                let touch = e.touches[0]
                const x = touch.pageX - element.offsetLeft;
                const slidMove = x - startX;
                let move = CNTWidth + gap_between_CNT
                if(CWwidth > screenWidth){
                    if(slidMove<0){
                        CWHolder.style.justifyContent = 'flex-end';
                        CW.style.transform = `translatex(${-move}px)`;
                        CMD = -1
                    }
                    if(slidMove>0){
                        CWHolder.style.justifyContent = 'flex-start';
                        CW.style.transform = `translatex(${move}px)`;
                        CMD = 1
                    }
                }
            }, { passive: true })


            // ADDING LEFT RIGHT NAVIGATION BUTTON
            const addNevigationButton = () =>{
                let NevigationButton = document.createElement('div');
                NevigationButton.className = 'NavigationButtons';

                let NVbtnPrevious = document.createElement('div');
                NVbtnPrevious.className = 'Previous PeVNCommon';
                NVbtnPrevious.innerHTML = '&lsaquo;';

                let NVbtnNext = document.createElement('div');
                NVbtnNext.className = 'Next PeVNCommon';
                NVbtnNext.innerHTML = '&rsaquo;';

                NevigationButton.prepend(NVbtnPrevious)
                NevigationButton.appendChild(NVbtnNext)
                element.appendChild(NVbtnPrevious)
                element.appendChild(NVbtnNext)

                

                NVbtnPrevious.addEventListener('click', ()=>{
                    if (CMD == -1){
                        CMD = 1
                    }
                    let move = CNTWidth + gap_between_CNT
                    CWHolder.style.justifyContent = 'flex-start';
                    CW.style.transform = `translatex(${move}px)`;
                })
                NVbtnNext.addEventListener('click', ()=>{
                    CMD = -1
                    let move = CNTWidth + gap_between_CNT
                    CWHolder.style.justifyContent = 'flex-end';
                    CW.style.transform = `translatex(${-move}px)`;
                })
            }

            // ADDING TOGGLER NAVIGATION BUTTON
            const createMultiNavBtn = () => {
                let counter_click = document.createElement('div')
                counter_click.className = `counter_click`;
                if ((ParentElm.children.length == 1)){
                    for(let i = 0; i < totalCNT; i++) {
                        let CarouselClass = CW.children[i].classList[0];
                        if(isNaN(CarouselClass) == true){
                            CW.children[i].className = (`${i+1} ${CarouselClass}`)
                        }
                        let new_div = document.createElement('div');
                        new_div.innerText = (i+1)
                        new_div.className = `Slider_Button`;
                        counter_click.appendChild(new_div);

                        // if (i==1){
                        //     new_div.classList.add('Slider_Button_Active')
                        // }
                        
                        // // if (CNTWidth > screenWidth){
                        // //     CW.children[i].style.maxWidth = `${screenWidth}px`;
                        // //     CWHolder.style.transform = `translatex(${-(screenWidth+gap_between_CNT)}px)`;
                        // // }
                        // // if((CNTdisplaing<=2) & (totalCNT==2) & ((2*CNTWidth+gap_between_CNT) > screenWidth)){
                        // //     move = (screenWidth-CNTWidth)/2
                        // //     CWHolder.style.maxWidth = `${CNTWidth}px`;
                        // //     CWHolder.style.transform = `translatex(${move}px)`;
                        // //     CW.children[i].style.minWidth = `${CNTWidth}px`;
                        // // }
                    }
                    if (totalCNT > 2){
                        ParentElm.appendChild(counter_click);
                    }
                }

            }

            // ON-RESIZE THE WINDOW RESIZE THOSE CONTENT
            window.addEventListener('resize', ()=>{
                clearTimeout(timeOutFunctionId);
                timeOutFunctionId = "";
                clearInterval(InterValId);
                InterValId = "";
                if(CWwidth <= screenWidth){
                    if(element.children.length>1){
                        element.removeChild(element.children[1])
                        element.removeChild(element.children[1])
                    }
                }
                timeOutFunctionId = setTimeout(Carousel, 3000);
            })

            if(CWwidth < screenWidth){
                CWHolder.style.transform = `none`;
                CW.style.transform = `none`;
                CWHolder.style.justifyContent = 'center';
                
                if ((totalCNT > 2) & (ParentElm.children[1] != undefined)){
                    ParentElm.removeChild(ParentElm.children[1])
                }
            }
            if(CWwidth > screenWidth){
                CWHolder.style.transform = `translatex(${-xMove}px)`;
                clearInterval(InterValId);
                InterValId = "";
                if (!InterValId) InterValId = setInterval(moveCarousel, sliding_duration);
                addNevigationButton();
                createMultiNavBtn();
            }
            if((CNTdisplaing==2) & (totalCNT>2)){
                move = (CNTWidth-((screenWidth-CNTWidth)/2))+gap_between_CNT
                CWHolder.style.transform = `translatex(${-move}px)`;
            }
            
            if((CNTdisplaing<=2) & (totalCNT<2)){
                CWHolder.style.transform = `translatex(${0}px)`;
                CW.style.width = `${CNTWidth}px`;
            }
        }
        window.addEventListener('load', () => {
            Carousel();
        })
    })
}