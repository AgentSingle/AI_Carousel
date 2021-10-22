let Slider_Wrapper = document.querySelectorAll('.Slider_Wrapper');
const sliding_duration = 3000;

if (Slider_Wrapper[0] != undefined){

    Slider_Wrapper.forEach((element)=>{
        let timeOutFunctionId = "";
        let InterValId = "";
        let Carouse_Moving = 'Moving';
        // let ParentElm = element.parentElement;
        // let CMD = -1; /* Carousel Movement Direction */
        
        element.addEventListener('touchstart', () => {
            Carouse_Moving='';
        })

        element.addEventListener('mouseenter', () => {
            Carouse_Moving='';
        })

        element.addEventListener('touchend', () => {
            Carouse_Moving='Moving';
        })

        element.addEventListener('mouseleave', () => {
            Carouse_Moving='Moving';
        })

        const TransitionFunction = ()=>{
            let CWHolder = element.firstElementChild; 
            let CW = CWHolder.firstElementChild;
            CW.addEventListener('transitionend', () => {
                CW.appendChild(CW.firstElementChild);
                CW.style.transition = 'none';
                CW.style.transform = `translatex(${0}px)`;
                setTimeout(()=>{
                    console.warn('ok')
                    CW.style.transition = 'all 0.5s ease-in-out 0.5s';
                })
            });
        }
        TransitionFunction();

        const Carousel = ()=>{
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
            

            const moveCarousel = () =>{
                let move = CNTWidth + gap_between_CNT
                CW.style.transform = `translatex(${-move}px)`; 
            }
            
            window.addEventListener('resize', ()=>{
                clearTimeout(timeOutFunctionId);
                timeOutFunctionId = "";
                clearInterval(InterValId);
                InterValId = "";
                timeOutFunctionId = setTimeout(Carousel, 3000);
            })
            if(CWwidth > screenWidth){
                CWHolder.style.transform = `none`;
                CW.style.transform = `none`; 
            }
            if(CWwidth > screenWidth){
                CWHolder.style.transform = `translatex(${-xMove}px)`;
                clearInterval(InterValId);
                InterValId = "";
                if (!InterValId) InterValId = setInterval(moveCarousel, sliding_duration);
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