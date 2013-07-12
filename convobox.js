function MessageDOMHandler(parent) {
  this.parent = parent;
  this.bind_events = function () {
    var that = this;
    $("body").on("click", ".message", function () {
      console.log("clicked");
      that.parent.next();
    });
  }
  this.draw = function (message) {
    console.log("Drawing");
    if (this.old_frame) this.old_frame.slideUp().remove();
    this.current_frame = $("<div class='message'>").hide();

    this.render(message);
    $("body").prepend(this.current_frame);
    this.current_frame.slideDown();
    this.old_frame = this.current_frame;
  }
  this.render = function (message) {
    this.current_frame.prepend($("<div>").text(message.text));
  }
};

function messageGroup(arr) {
  this._messages = arr;
  this.dom_handler = new MessageDOMHandler(this);
  ;
  this.previous_nodes = [];
  this.messages = function () {
    return _.chain(this._messages);
  };
  this.start = function () {
    this.bind_events();
    this.draw();
  };
  this.bind_events = function () {
    this.dom_handler.bind_events();

  };
  this.draw = function () {
    this.draw_active_message();
  };
  this.stop = function () {};
  this.draw_active_message = function () {
    var active_message = this.find_active_message();
    if (active_message) {
      this.dom_handler.draw(active_message);
    }
  };
  this.find_active_message = function () {
    var active_message = this.messages().findWhere({
      active: true
    }).value();
    if (!active_message) {
      active_message = _.first(this._messages);
      active_message.active = true;
    }
    return active_message;
  };
  this.activate = function (index) {
    console.log("activating ", index);
    if (!_.isUndefined(index) && this._messages[index]) {
      console.log("successfully activated");

      this._messages[index].active = true;
      return true;

    } else {
      return false;
    }
  }
  this.deactivate = function (index) {
    console.log("deactivating ", index);
    if (!_.isUndefined(index) && this._messages[index]) {
      console.log("successfully deactivated");

      this._messages[index].active = false;
      return true;
    } else {
      return false;
    }
  };
  this.on_last_message = function () {
    return this.active_index() + 1 >= this._messages.length;

  }
  this.insert_message = function(message) {
    <this class=""></this>

  }
  this.next = function () {

    console.log(this._messages);
    if (! this.on_last_message() ) {
      var currently_active_index = this.active_index();
      var deactivated = this.deactivate(currently_active_index);
      this.store(currently_active_index);
      var activated = this.activate(currently_active_index + 1);
      if (activated && deactivated) {
        this.draw();
      }
    } else {
      console.log("on last message, can't advance further");
    }
  };
  this.store = function (index) {
    this.previous_nodes.push(index);
  }
  this.back = function () {
    console.log("back");
    if (this.previous_nodes.length) {
      console.log("pop it");
      this.deactivate(this.active_index());
      this.activate(this.previous_nodes.pop())
      this.draw();
    } else {
      console.log("Can't go back if you haven't visited any nodes");
    }

  };
  this.active_index = function () {
    var mlength = this._messages.length;
    for (var i = 0; i < mlength; i++) {
      if (this._messages[i].active) {
        return i;
      }
    }
  };
}
var mgroup = new messageGroup([{
  text: "lol"
}, {
  text: "foo"
}]);
console.log(mgroup);
$("#back").click(function () {
  mgroup.back();
});
mgroup.start();
