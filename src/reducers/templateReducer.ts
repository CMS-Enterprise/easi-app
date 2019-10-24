// TODO: We may want to store interfaces/type aliases in a separate file
interface TemplateInterface {}

const initialState: TemplateInterface = {};

function templateReducer(state = initialState, action: any): TemplateInterface {
  switch (action.type) {
    case '':
      return state;
    default:
      return state;
  }
}

export default templateReducer;
