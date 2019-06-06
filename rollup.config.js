import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import nodent from 'rollup-plugin-nodent'


export default {
  input: 'src/index.js',
  plugins: [
    resolve(),
    // See https://github.com/oligot/rollup-plugin-nodent/issues/3#issuecomment-321800029
    nodent({
      promises: true,
      noRuntime: true,
    }),
    buble({objectAssign: 'Object.assign'}),
  ],
  output: [
    {
      format: 'cjs',
      file: 'dist/index.cjs.js',
    },
    {
      format: 'esm',
      file: 'dist/index.esm.js',
    },
  ],
}
