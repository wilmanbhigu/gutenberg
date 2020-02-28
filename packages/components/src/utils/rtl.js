/**
 * External dependencies
 */
import { css } from '@emotion/core';

const LOWER_LEFT_REGEXP = new RegExp( /-left/g );
const LOWER_RIGHT_REGEXP = new RegExp( /-right/g );
const UPPER_LEFT_REGEXP = new RegExp( /Left/g );
const UPPER_RIGHT_REGEXP = new RegExp( /Right/g );

/**
 * Checks to see whether the document is set to rtl.
 *
 * @return {boolean} Whether document is RTL.
 */
function getRtl() {
	return !! ( document && document.documentElement.dir === 'rtl' );
}

/**
 * Simple hook to retrieve RTL direction value
 *
 * @return {boolean} Whether document is RTL.
 */
export function useRtl() {
	return getRtl();
}

/**
 * Flips a CSS property from left <-> right.
 *
 * @param {string} key The CSS property name.
 *
 * @return {string} The flipped CSS property name, if applicable.
 */
function getConvertedKey( key ) {
	if ( key === 'left' ) {
		return 'right';
	}

	if ( key === 'right' ) {
		return 'left';
	}

	if ( LOWER_LEFT_REGEXP.test( key ) ) {
		return key.replace( LOWER_LEFT_REGEXP, '-right' );
	}

	if ( LOWER_RIGHT_REGEXP.test( key ) ) {
		return key.replace( LOWER_RIGHT_REGEXP, '-left' );
	}

	if ( UPPER_LEFT_REGEXP.test( key ) ) {
		return key.replace( UPPER_LEFT_REGEXP, 'Right' );
	}

	if ( UPPER_RIGHT_REGEXP.test( key ) ) {
		return key.replace( UPPER_RIGHT_REGEXP, 'Left' );
	}

	return key;
}

/**
 * An incredibly basic ltr -> rtl converter for style properties
 *
 * @param {Object} ltrStyles
 *
 * @return {Object} Converted ltr -> rtl styles
 */
export const convertLtrToRtl = ( ltrStyles = {} ) => {
	const nextStyles = {};

	for ( const key in ltrStyles ) {
		const value = ltrStyles[ key ];
		const nextKey = getConvertedKey( key );
		nextStyles[ nextKey ] = value;
	}

	return nextStyles;
};

/**
 * An incredibly basic ltr -> rtl style converter for CSS objects.
 *
 * @param {Object} ltrStyles Ltr styles. Converts and renders from ltr -> rtl styles, if applicable.
 * @param {null|Object} rtlStyles Rtl styles. Renders if provided.
 * @return {Object} Rendered CSS styles for Emotion's renderer
 */
export function rtl( ltrStyles = {}, rtlStyles ) {
	return () => {
		const isRtl = getRtl();

		if ( rtlStyles ) {
			return isRtl ? css( rtlStyles ) : css( ltrStyles );
		}

		return isRtl ? css( convertLtrToRtl( ltrStyles ) ) : css( ltrStyles );
	};
}
