import React, { Component, MouseEvent } from 'react'
import EachStar from '../utils/eachStar'
import styles from '../styles/rating/starRating.module.css'

interface StarRatingState {
  rateValue: boolean[]
  hoverRateValue: boolean[]
  isHover: boolean
}

interface StarRatingProps {
  size: number
  rate: number // 추가: rate prop을 정의합니다.
  onRateChange: (newRate: number) => void // 새로운 rate를 부모 컴포넌트로 전달할 콜백 추가
}

export default class StarRating extends Component<
  StarRatingProps,
  StarRatingState
> {
  constructor(props: StarRatingProps) {
    super(props)
    this.state = {
      rateValue: [false, false, false, false, false],
      hoverRateValue: [false, false, false, false, false],
      isHover: false,
    }
  }

  handleStarClick = (clickedIndex: number): void => {
    const prevRateValue = [...this.state.rateValue]
    const isClickedStarActive = prevRateValue[clickedIndex]
    const isNextStarActive = prevRateValue[clickedIndex + 1]

    if (isClickedStarActive && isNextStarActive) {
      prevRateValue.fill(false, clickedIndex + 1)

      this.setState(
        {
          isHover: false,
          hoverRateValue: [false, false, false, false, false],
          rateValue: prevRateValue,
        },
        () => {
          // rateValue가 업데이트된 후에 콜백을 호출
          this.props.onRateChange(prevRateValue.filter((value) => value).length)
        },
      )

      return
    }

    if (isClickedStarActive) {
      prevRateValue.fill(false, 0, clickedIndex + 1)

      this.setState(
        {
          isHover: false,
          hoverRateValue: [false, false, false, false, false],
          rateValue: prevRateValue,
        },
        () => {
          // rateValue가 업데이트된 후에 콜백을 호출
          this.props.onRateChange(prevRateValue.filter((value) => value).length)
        },
      )

      return
    }

    if (!isClickedStarActive) {
      prevRateValue.fill(true, 0, clickedIndex + 1)

      this.setState(
        {
          isHover: false,
          hoverRateValue: [false, false, false, false, false],
          rateValue: prevRateValue,
        },
        () => {
          // rateValue가 업데이트된 후에 콜백을 호출
          this.props.onRateChange(prevRateValue.filter((value) => value).length)
        },
      )

      return
    }
  }

  handleStarMousehover = (hoveredIndex: number): void => {
    const prevRateValue = [...this.state.hoverRateValue]
    const isClickedStarActive = prevRateValue[hoveredIndex]
    const isNextStarActive = prevRateValue[hoveredIndex + 1]

    if (isClickedStarActive && isNextStarActive) {
      prevRateValue.fill(false, hoveredIndex + 1)

      this.setState({
        isHover: true,
        hoverRateValue: prevRateValue,
      })

      return
    }

    if (isClickedStarActive) {
      prevRateValue.fill(false, 0, hoveredIndex + 1)

      this.setState({
        isHover: true,
        hoverRateValue: prevRateValue,
      })

      return
    }

    if (!isClickedStarActive) {
      prevRateValue.fill(true, 0, hoveredIndex + 1)

      this.setState({
        isHover: true,
        hoverRateValue: prevRateValue,
      })

      return
    }
  }

  // componentDidUpdate 함수는 클래스 컴포넌트의 메서드 중 하나로, 컴포넌트가 업데이트될 때 호출됩니다.
  // 따라서 StarRating 컴포넌트 내에서 componentDidUpdate를 정의하고 사용하면 됩니다.

  componentDidUpdate(prevProps: StarRatingProps) {
    if (this.props.rate !== prevProps.rate) {
      // rate 값이 변경되면 별점을 다시 그립니다.
      this.setState({
        rateValue: this.createRateArray(this.props.rate),
      })
    }
  }

  createRateArray(rate: number): boolean[] {
    const rateArray = [false, false, false, false, false]
    for (let i = 0; i < rate; i++) {
      rateArray[i] = true
    }
    return rateArray
  }

  handleStarMouseout = (): void => {
    this.setState({
      isHover: false,
      hoverRateValue: [false, false, false, false, false],
    })
  }

  checkIsActive = (star: number): string => {
    if (this.state.isHover) {
      if (this.state.hoverRateValue[star]) {
        return 'activeStar'
      }

      return 'inactiveStar'
    }

    if (this.state.rateValue[star]) {
      return 'activeStar'
    }

    return 'inactiveStar'
  }

  render() {
    const starArray = [0, 1, 2, 3, 4]

    return (
      <>
        <div className={styles.starList}>
          {' '}
          {/* Use styles.starList */}
          {starArray.map((star, index) => (
            <button
              key={index}
              onClick={() => this.handleStarClick(star)}
              onMouseEnter={() => this.handleStarMousehover(star)}
              onMouseLeave={() => this.handleStarMouseout()}
            >
              <EachStar
                size={this.props.size}
                name={this.checkIsActive(Number(star))}
              />
            </button>
          ))}
        </div>
      </>
    )
  }
}
