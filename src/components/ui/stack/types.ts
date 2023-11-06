export interface StackProps {
  children: React.ReactNode,
  space?: 1 | 2 | 4 | 8 | 12 | 16,
  align?: 'start' | 'center' | 'end',
  justify?:
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch',
  direction?: 'row' | 'column',
  className?: string,
}
