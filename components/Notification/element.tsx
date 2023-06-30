import styled from 'styled-components'
import { useEffect } from 'react'

interface ElementProps {
  type?: boolean
  defaultChecked?: boolean
}

const Wrapper = styled.div<ElementProps>`
  position: fixed;
  z-index: 9999;
  right: ${props => !props.defaultChecked && '0px'};
  top: 110px;
  left: ${props => props.defaultChecked && '0px'};
  display: flex;
  justify-content: center;
  border-radius: 200px 0px 0px 200px;
  box-shadow: 0px 8px 24px rgba(71, 94, 82, 0.25);
  border: 1px solid;
  border-color: ${props => (props.type ? 'green' : 'red')};
  min-width: 280px;
  padding: ${props => (!props.defaultChecked ? '5px 10px 5px 21px' : '5px 21px 5px 10px')};
  background: white;
`

const ContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`

const Title = styled.div<ElementProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 800;
  line-height: 32px;
  color: ${props => (props.type ? '#38B000' : '#B01A00')};
  & > i {
    margin-right: 10px;
  }
  & > svg {
    margin-right: 10px;
  }
  & > span {
    vertical-align: middle;
  }
`

const Text = styled.span<ElementProps>`
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  text-decoration-line: underline;
  color: ${props => (props.type ? '#38B000' : '#B01A00')};
`

const Notification = ({ id, title = 'Title', txHash = 'tx', left = false, type = false, remove }) => {
  // type is success or error. true is success, false is error

  useEffect(() => {
    if (id) {
      const timer = setTimeout(() => {
        remove(id)
      }, 5000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [id])

  const onClickText = () => {
    // window.open(`https://blueprints.juno.giansalex.dev/#/transactions/${txHash}`, '_blank')
    window.open(`https://www.mintscan.io/juno/txs/${txHash}`, '_blank')
    
  }

  return (
    <Wrapper
      style={{
        borderRadius: left && '0 200px 200px 0',
        right: left && 'unset',
        left: left && '0',
        filter: 'none',
      }}
      type={type}
    >
      <ContentWrapper>
        <i
          className="fas fa-times"
          style={{ position: 'absolute', right: 10, cursor: 'pointer', color: '#7C7C7C' }}
          onClick={() => remove(id)}
        ></i>
        <Title type={type}>
          {type ? (
            <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 1L6 12L1 7" stroke="#38B000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.2908 3.85996L1.82075 18C1.64612 18.3024 1.55372 18.6453 1.55274 18.9945C1.55176 19.3437 1.64224 19.6871 1.81518 19.9905C1.98812 20.2939 2.23748 20.5467 2.53846 20.7238C2.83944 20.9009 3.18155 20.9961 3.53075 21H20.4708C20.82 20.9961 21.1621 20.9009 21.463 20.7238C21.764 20.5467 22.0134 20.2939 22.1863 19.9905C22.3593 19.6871 22.4497 19.3437 22.4488 18.9945C22.4478 18.6453 22.3554 18.3024 22.1808 18L13.7108 3.85996C13.5325 3.56607 13.2815 3.32308 12.9819 3.15444C12.6824 2.98581 12.3445 2.89722 12.0008 2.89722C11.657 2.89722 11.3191 2.98581 11.0196 3.15444C10.72 3.32308 10.469 3.56607 10.2908 3.85996V3.85996Z"
                stroke="#B01A00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 9V13" stroke="#B01A00"  stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 17H12.01" stroke="#B01A00"  stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          )}
          <span>{title}</span>
        </Title>
        <Text type={type} onClick={onClickText}>
          Click here for corresponding tx
        </Text>
      </ContentWrapper>
    </Wrapper>
  )
}

export default Notification
