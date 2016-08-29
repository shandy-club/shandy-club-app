import React from 'react'
import uuid from 'node-uuid'

const SearchFeatures = ({ features, toggleFeature }) => {

  // TODO - active class
  const featureList = Object.keys(features).map( f => (
    <div key={uuid.v4()} onClick={ () => toggleFeature(f) }>{ f }</div>
  ))

  return (
    <div>
      { featureList }
    </div>
  )

}

export default SearchFeatures