<template>
  <div
    :class="[
      'sidebar-area position-fixed start-0 top-0 bg-black h-100vh transition',
      { active: stateStoreInstance.open },
    ]"
    id="sidebar-area"
  >
    <div class="logo position-absolute start-0 end-0 top-0 bg-black">
      <router-link
        to="/"
        class="d-flex align-items-center text-white text-decoration-none"
      >
        <img src="../../assets/images/Sobathr logo white.png" alt="logo-icon" />
        <span class="fw-bold ms-10"></span>
      </router-link>
      <div class="border-bottom"></div>
      <button
        class="sidebar-burger-menu position-absolute lh-1 bg-transparent p-0 border-0"
        @click="stateStoreInstance.onChange"
      >
        <i class="ph-duotone ph-caret-double-right"></i>
      </button>
    </div>
    <div class="sidebar-menu">
      <ul
        class="sidebar-navbar-nav ps-0 mb-0 list-unstyled accordion"
        id="sidebarNavAccordion"
      >
        <li
          class="sidebar-nav-item accordion-item bg-transparent border-0 rounded-0"
        >
          <a
            href="#"
            class="accordion-button rounded-0 shadow-none bg-transparent d-block"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarCollapseOne"
            aria-expanded="true"
            aria-controls="sidebarCollapseOne"
          >
            <i class="flaticon-more-1"></i>
            <span class="title">Dashboard</span>
          </a>
          <div
            id="sidebarCollapseOne"
            class="accordion-collapse collapse show"
            data-bs-parent="#sidebarNavAccordion"
          >
            <!-- <div class="accordion-body">
              <ul class="sidebar-sub-menu ps-0 mb-0 list-unstyled">
                <li class="sidebar-sub-menu-item">
                  <router-link to="/" class="sidebar-sub-menu-link">
                    Dashboard SobatHR
                  </router-link>
                </li>
              </ul>
            </div> -->
          </div>
        </li>
        <li
          class="sidebar-nav-item accordion-item bg-transparent border-0 rounded-0"
        >
          <a
            href="#"
            class="accordion-button collapsed rounded-0 shadow-none bg-transparent d-block"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarCollapseTwentyOne"
            aria-expanded="false"
            aria-controls="sidebarCollapseTwentyOne"
          >
            <i class="flaticon-sugar-cubes"></i>
            <span class="title">Master</span>
          </a>
          <div
            id="sidebarCollapseTwentyOne"
            class="accordion-collapse collapse"
            data-bs-parent="#sidebarNavAccordion"
          >
            <div class="accordion-body">
              <ul class="sidebar-sub-menu ps-0 mb-0 list-unstyled">
                <li class="sidebar-sub-menu-item">
                  <router-link to="/master-company-branch" class="sidebar-sub-menu-link">
                    Company Branch
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link to="/master-employee-list" class="sidebar-sub-menu-link">
                    Employee
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/master-shift-list"
                    class="sidebar-sub-menu-link"
                  >
                    Shift
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/master-shift-type-list"
                    class="sidebar-sub-menu-link"
                  >
                    Shift Type
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/master-position-page"
                    class="sidebar-sub-menu-link"
                  >
                    Positions
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link to="/master-levelposition-page" class="sidebar-sub-menu-link">
                    Level Positions
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/master-working-calendar"
                    class="sidebar-sub-menu-link"
                  >
                    Working Calendar
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/master-working-schedule"
                    class="sidebar-sub-menu-link"
                  >
                    Working Schedule
                  </router-link>
                </li>

              </ul>
            </div>
          </div>
        </li>
        <li
          class="sidebar-nav-item accordion-item bg-transparent border-0 rounded-0"
        >
          <a
            href="#"
            class="accordion-button collapsed rounded-0 shadow-none bg-transparent d-block"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarCollapseTwentyOne"
            aria-expanded="false"
            aria-controls="sidebarCollapseTwentyOne"
          >
            <i class="flaticon-sugar-cubes"></i>
            <span class="title">Attendance</span>
          </a>
          <div
            id="sidebarCollapseTwentyOne"
            class="accordion-collapse collapse"
            data-bs-parent="#sidebarNavAccordion"
          >
            <div class="accordion-body">
              <ul class="sidebar-sub-menu ps-0 mb-0 list-unstyled">
                <li class="sidebar-sub-menu-item">
                  <router-link to="/daily-attendance" class="sidebar-sub-menu-link">
                    Daily Attencance
                  </router-link>
                </li>
                </ul>
                </div>
            <div class="accordion-body">
              <ul class="sidebar-sub-menu ps-0 mb-0 list-unstyled">
                <li class="sidebar-sub-menu-item">
                  <router-link to="/attendance-summary" class="sidebar-sub-menu-link">
                    Attendance Summary
                  </router-link>
                </li>
                </ul>
                </div>
                </div>
                </li>
        <!-- <li
          class="sidebar-nav-item accordion-item bg-transparent border-0 rounded-0"
        >
          <a
            href="#"
            class="accordion-button collapsed rounded-0 shadow-none bg-transparent d-block"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarCollapseTwentyTwo"
            aria-expanded="false"
            aria-controls="sidebarCollapseTwentyTwo"
          >
            <i class="flaticon-setting"></i>
            <span class="title">Settings</span>
          </a>
          <div
            id="sidebarCollapseTwentyTwo"
            class="accordion-collapse collapse"
            data-bs-parent="#sidebarNavAccordion"
          >
            <div class="accordion-body">
              <ul class="sidebar-sub-menu ps-0 mb-0 list-unstyled">
                <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/account-settings"
                    class="sidebar-sub-menu-link"
                  >
                    Account Setting
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/settings-change-password"
                    class="sidebar-sub-menu-link"
                  >
                    Change Password
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/settings-social-links"
                    class="sidebar-sub-menu-link"
                  >
                    Social Link
                  </router-link>
                </li>
                <li class="sidebar-sub-menu-item">
                  <router-link
                    to="/settings-privacy-policy"
                    class="sidebar-sub-menu-link"
                  >
                    Privacy Policy
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </li> -->
        <!-- <li
          class="sidebar-nav-item accordion-item bg-transparent border-0 rounded-0"
        >
          <a
            href="#"
            class="accordion-button collapsed rounded-0 shadow-none bg-transparent d-block"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarCollapseTwentyThree"
            aria-expanded="true"
            aria-controls="sidebarCollapseTwentyThree"
          >
            <i class="flaticon-download"></i>
            <span class="title">Multi Level</span>
          </a>
          <div
            id="sidebarCollapseTwentyThree"
            class="accordion-collapse collapse"
            data-bs-parent="#sidebarNavAccordion"
          >
            <div class="accordion-body">
              <ul class="sidebar-sub-menu ps-0 mb-0 list-unstyled">
                <li class="sidebar-sub-menu-item">
                  <a href="#" class="sidebar-sub-menu-link"> Level One </a>
                </li>
                <li class="sidebar-sub-menu-item">
                  <a href="#" class="sidebar-sub-menu-link"> Level Two </a>
                </li>
                <li class="sidebar-sub-menu-item">
                  <ul
                    class="sidebar-navbar-nav ps-0 mb-0 list-unstyled accordion"
                    id="sidebarInnerNavAccordion"
                  >
                    <li
                      class="sidebar-nav-item accordion-item bg-transparent border-0 rounded-0"
                    >
                      <a
                        href="#"
                        class="accordion-button collapsed rounded-0 shadow-none bg-transparent d-block"
                        data-bs-toggle="collapse"
                        data-bs-target="#sidebarInnerCollapseOne"
                        aria-expanded="true"
                        aria-controls="sidebarInnerCollapseOne"
                      >
                        <span class="title">Second Level</span>
                      </a>
                      <div
                        id="sidebarInnerCollapseOne"
                        class="accordion-collapse collapse"
                        data-bs-parent="#sidebarInnerNavAccordion"
                      >
                        <div class="accordion-body">
                          <ul class="sidebar-sub-menu ps-0 mb-0 list-unstyled">
                            <li class="sidebar-sub-menu-item">
                              <a href="#" class="sidebar-sub-menu-link">
                                Level One
                              </a>
                            </li>
                            <li class="sidebar-sub-menu-item">
                              <a href="#" class="sidebar-sub-menu-link">
                                Level Two
                              </a>
                            </li>
                            <li class="sidebar-sub-menu-item">
                              <ul
                                class="sidebar-navbar-nav ps-0 mb-0 list-unstyled accordion"
                                id="sidebarInner2NavAccordion"
                              >
                                <li
                                  class="sidebar-nav-item accordion-item bg-transparent border-0 rounded-0"
                                >
                                  <a
                                    href="#"
                                    class="accordion-button collapsed rounded-0 shadow-none bg-transparent d-block"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#sidebarInner2CollapseOne"
                                    aria-expanded="true"
                                    aria-controls="sidebarInner2CollapseOne"
                                  >
                                    <span class="title">Third Level</span>
                                  </a>
                                  <div
                                    id="sidebarInner2CollapseOne"
                                    class="accordion-collapse collapse"
                                    data-bs-parent="#sidebarInner2NavAccordion"
                                  >
                                    <div class="accordion-body">
                                      <ul
                                        class="sidebar-sub-menu ps-0 mb-0 list-unstyled"
                                      >
                                        <li class="sidebar-sub-menu-item">
                                          <a
                                            href="#"
                                            class="sidebar-sub-menu-link"
                                          >
                                            One
                                          </a>
                                        </li>
                                        <li class="sidebar-sub-menu-item">
                                          <a
                                            href="#"
                                            class="sidebar-sub-menu-link"
                                          >
                                            Two
                                          </a>
                                        </li> -->
                                      <!-- </ul>
                                    </div>
                                  </div>
                                </li> -->
                              <!-- </ul>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </li> -->
        <!-- <li class="sidebar-nav-item">
          <router-link to="/logout" class="sidebar-nav-link d-block">
            <i class="flaticon-logout"></i>
            <span class="title">Logout</span>
          </router-link>
        </li> -->
        
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import stateStore from "../../utils/store";

export default defineComponent({
  name: "MainSidebar",
  setup() {
    const stateStoreInstance = stateStore;
    return {
      stateStoreInstance,
    };
  },
});
</script>