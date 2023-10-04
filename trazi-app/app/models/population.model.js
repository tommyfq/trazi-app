module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        city: String,
        state: String,
        population: Number
      },
      { timestamps: true }
    );
  
    // Create an index on the 'state' field
    schema.index({ state: 1 });

    // Create an index on the 'city' field
    schema.index({ city: 1 });

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Population = mongoose.model("population", schema);
    return Population;
  };
  