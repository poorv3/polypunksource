import gsap, { TweenMax } from 'gsap';
import $, { Draggable } from 'jquery';
import { func } from 'prop-types';
class Watch {
    init(that) {
        // Scroll To Top on Page change
        $('.APP .SCROLLVIEW').scrollTop(0)

        // PunkCards showing overflow attrs
        this.PunkardWatch()
    }
    PunkardWatch() {
        $('.APP .Punkontainer .Punkard').on('mouseenter', function () {
            let ticker = $(this).find($('.attrs'))
            let attrItemsSumSize = 0;
            $(ticker).find($('.attr')).each(function () {
                attrItemsSumSize = attrItemsSumSize + $(this).width() + 6 + 10
            })
            if (attrItemsSumSize >= $(ticker).width() - 70) {
                const overSize = attrItemsSumSize - $(ticker).width() + 100
                const tw = TweenMax.to(ticker, 2, {
                    x: -overSize,
                    ease: 'none'
                });
                this.tw = tw
            } else {
                this.tw = {
                    kill: () => null
                }
            }
        });
        $('.APP .Punkontainer .Punkard').on('mouseleave', function () {
            let ticker = $(this).find($('.attrs'))
            this.tw && this.tw.kill();
            TweenMax.to(ticker, 0.2, {
                x: 0
            });
        })
    }
    punksScrollLoad(that, forceGap) {
        let scrollBlock = false
        const watch = this
        $('.APP .SCROLLVIEW').on('scroll', function () {
            if (parseInt($(this).scrollTop()) >= parseInt($('.APP .Punkontainer').height() - (forceGap || 800))) {
                add50ToPunksLenght()
                watch.PunkardWatch()
                scrollBlock = false
            }
        });
        const add50ToPunksLenght = () => {
            if (!scrollBlock) {
                that.setState({
                    interf: {
                        ...that.state.interf,
                        lengthOfShowingPunks: that.state.interf.lengthOfShowingPunks + 50
                    }
                })
                scrollBlock = true
            }
        }
    }
}
export default new Watch();