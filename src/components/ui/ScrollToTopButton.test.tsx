import { fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { ScrollToTopButton } from './ScrollToTopButton'

function Demo() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative">
      <div ref={scrollRef} data-testid="scrollable">
        conteúdo longo
      </div>
      <ScrollToTopButton targetRef={scrollRef} />
    </div>
  )
}

describe('ScrollToTopButton', () => {
  it('appears after the threshold and smooth scrolls back to the top', () => {
    render(<Demo />)
    const scrollable = screen.getByTestId('scrollable')
    scrollable.scrollTo = vi.fn()

    expect(
      screen.queryByRole('button', { name: 'Voltar ao topo' }),
    ).not.toBeInTheDocument()

    scrollable.scrollTop = 400
    fireEvent.scroll(scrollable)

    const button = screen.getByRole('button', { name: 'Voltar ao topo' })
    fireEvent.click(button)
    expect(scrollable.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })

    scrollable.scrollTop = 0
    fireEvent.scroll(scrollable)
    expect(
      screen.queryByRole('button', { name: 'Voltar ao topo' }),
    ).not.toBeInTheDocument()
  })
})
