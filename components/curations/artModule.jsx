import { useEffect, useMemo, useRef, useState } from 'react';
import EditWrapper from '../curatorProfile/editWrapper';
import EditArtModuleModal from './editArtModuleModal';
import clsx from 'clsx';
import useBreakpoints from '../../hooks/useBreakpoints';
import debounce from 'lodash.debounce';
import { getTokenAspectRatio } from '../../hooks/useNftFiles';
import ArtItem from './artModuleItem';
import * as Icon from 'react-feather';

const ArtModule = ({
  artModule,
  onEditArtModule,
  isOwner, 
  submittedTokens, 
  onDeleteModule, 
  approvedArtists, 
  handleCollect, 
  tokenMintsInUse, 
  curationType,
  curationId,
  setSubmittedTokens,
  owners
}) => {
  const breakpoint = useBreakpoints()  
  const isMobile = ["", "sm", "md"].includes(breakpoint)
  const isTablet = ["lg", "xl"].includes(breakpoint)
  const [editArtOpen, setEditArtOpen] = useState(false)

  const wrapperRef = useRef(null)

  const [wrapperWidth, setWrapperWidth] = useState(0)
  const [maxHeight, setMaxHeight] = useState(0)

  const gapSize = 24 //in pixels (must be inline styled so that row height calculations can take the exact number into account)
  const maxHeightRatio = 0.75 //in percentage of window height

  useEffect(() => { 
    const getDimensions = () => { 
      if(!wrapperRef.current) return
      const rowWidth = wrapperRef.current.offsetWidth
      setWrapperWidth(rowWidth)

      setMaxHeight(window.innerHeight * maxHeightRatio)
    }

    getDimensions()

    const debouncedGetDimensions = debounce(getDimensions, 250)

    window.addEventListener('resize', debouncedGetDimensions)
    return () => {
      debouncedGetDimensions.cancel()
      window.removeEventListener('resize', debouncedGetDimensions)
    }
  }, [])

  const { mappedTokens, mappedAspectRatios } = useMemo(() => { 
    //Map out tokens and aspect ratio
    const mappedTokens = {}
    const mappedAspectRatios = {}


    submittedTokens.forEach(token => { 
      const mint = token.mint;
      
      mappedAspectRatios[mint] = getTokenAspectRatio(token)
      mappedTokens[mint] = token
    })
    return {
      mappedTokens,
      mappedAspectRatios,
    }
  }, [submittedTokens])

  const tokenRows = useMemo(() => { 
    if (!Object.values(mappedTokens).length) return []

    const tokenMints = artModule.tokens

    const tokens = tokenMints.map(mint => mappedTokens?.[mint]).filter(t => Boolean(t))

    const useHalfRow = isTablet && tokens.length > 2
    const halfIndex = Math.floor(tokens.length / 2)
    const rows =
      isMobile
        ? tokens.map(mint => [mint])
        : useHalfRow
          ? [tokens.slice(0, halfIndex), tokens.slice(halfIndex)]
          : [tokens]
    
    return rows    
  }, [artModule.tokens, isMobile, isTablet, mappedTokens])

  const itemRows = useMemo(() => {
    if (!approvedArtists || !wrapperWidth || !tokenRows.length) return [];

    return tokenRows.map((tokens) => {
      const totalAspectRatio = tokens.reduce((acc, token) => {
        return acc + mappedAspectRatios[token.mint]
      }, 0)
      const rowGapOffset = gapSize * (tokens.length - 1)
      const rowHeight = Math.min((wrapperWidth - rowGapOffset) / totalAspectRatio, maxHeight)

      return tokens.map((token) => {
        const artist = approvedArtists.find(a => a.id === token.artist_id)
        const owner = owners?.find(o => o.id === token.owner_id)
        const tokenWidth = (mappedAspectRatios[token.mint] * rowHeight)
        const tokenHeight = rowHeight
        return (
          <ArtItem
            key={token.mint}
            token={token}
            artist={artist}
            handleCollect={handleCollect}
            height={tokenHeight}
            width={tokenWidth}
            curationType={curationType}
            owner={owner}
          />
        )
      })
    })
  }, [approvedArtists, handleCollect, mappedAspectRatios, tokenRows, wrapperWidth, maxHeight, curationType, owners])

  return (
    <div
      ref={wrapperRef}
      className={clsx("relative group w-full group/artRow min-h-[4rem] duration-300",
        // isVisible ? "opacity-100" : "opacity-0"
      )}
     
    >
      <EditWrapper
        isOwner={isOwner}
        onEdit={() => setEditArtOpen(true)}
        placement="outside-tr"
        groupHoverClass="group-hover/artRow:opacity-100"
        text="Edit Module"
        icon={<Icon.Image size={20} strokeWidth={2.5} />}
      >
        {itemRows.map((row, i) => {
          return (
            <div
              key={artModule.id + "row" + i}
              style={{gap: gapSize}} //gapSize must be coded so row height calculations can take them into account
              className={clsx("flex flex-col md:flex-row w-full mb-6")}
            >
              {row}
            </div>
          )
        })}
      </EditWrapper>
      {isOwner && !artModule.tokens.length
        ? (
          <div className='absolute inset-0 w-full h-full flex justify-center items-center p-2'
            onClick={() => setEditArtOpen(true)}
          >
            <p>Click the gear icon in the top right to edit this Art Module</p>
          </div>
        )
        : null
      }
      {isOwner
        ? (
          <EditArtModuleModal
            artModule={artModule}
            onEditArtModule={onEditArtModule}
            onDeleteModule={onDeleteModule}
            isOpen={editArtOpen}
            onClose={() => setEditArtOpen(false)}
            submittedTokens={submittedTokens}
            approvedArtists={approvedArtists}
            tokenMintsInUse={tokenMintsInUse}
            curationType={curationType}
            curationId={curationId}
            setSubmittedTokens={setSubmittedTokens}
          />
        )
        : null
      }
    </div>
  )
}

export default ArtModule;
