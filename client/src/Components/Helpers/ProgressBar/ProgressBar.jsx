import './ProgressBar.css'

function ProgressBar({percent,}) {
  return (
    <div className='progressBar' 
        style={{
            height: '100%',
            width: `${percent}%`,
            background: '#FD2CE8'
        }}
    >
    </div>
  )
}

export default ProgressBar