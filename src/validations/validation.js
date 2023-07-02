const validate = (schema, request) => {
  const options = {
    abortEarly: false,
    errors: {
      wrap: {
        label: false,
      },
    },
  };
  const result = schema.validate(request, options);

  if (result.error) {
    throw result.error;
  } else {
    return result.value;
  }
};

export default validate;
